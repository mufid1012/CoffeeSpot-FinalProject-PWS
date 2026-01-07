const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * GET /user/api-keys
 * Get all API keys for current user
 */
router.get('/api-keys', async (req, res, next) => {
    try {
        // Get API keys with today's usage from logs
        const [apiKeys] = await pool.query(
            `SELECT 
                ak.id, ak.name, ak.api_key, ak.status, ak.usage_limit, ak.created_at,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM api_logs al 
                    WHERE al.api_key_id = ak.id AND DATE(al.created_at) = CURDATE()
                ), 0) as daily_usage
             FROM api_keys ak
             WHERE ak.user_id = ? 
             ORDER BY ak.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: apiKeys
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /user/api-keys
 * Generate a new API key
 */
router.post('/api-keys', async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'API key name is required'
                }
            });
        }

        // Check limit (max 5 active keys per user)
        const [existing] = await pool.query(
            "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ? AND status = 'active'",
            [req.user.id]
        );

        if (existing[0].count >= 5) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'LIMIT_EXCEEDED',
                    message: 'Maximum 5 active API keys allowed'
                }
            });
        }

        // Generate unique API key
        const apiKey = 'cs_live_' + uuidv4().replace(/-/g, '');

        // Save to database
        const [result] = await pool.query(
            `INSERT INTO api_keys (user_id, api_key, name, last_reset_date) 
             VALUES (?, ?, ?, CURDATE())`,
            [req.user.id, apiKey, name]
        );

        res.status(201).json({
            success: true,
            message: 'API key created successfully',
            data: {
                id: result.insertId,
                name,
                api_key: apiKey, // Only show full key once
                status: 'active'
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /user/api-keys/:id
 * Revoke an API key
 */
router.delete('/api-keys/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const [keys] = await pool.query(
            'SELECT id FROM api_keys WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (keys.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'API key not found'
                }
            });
        }

        // Revoke key
        await pool.query(
            "UPDATE api_keys SET status = 'revoked' WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: 'API key revoked successfully'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /user/stats
 * Get user statistics
 */
router.get('/stats', async (req, res, next) => {
    try {
        // Get API key stats
        const [keyStats] = await pool.query(
            `SELECT 
                COUNT(*) as total_keys,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_keys,
                SUM(usage_limit) as total_limit
             FROM api_keys 
             WHERE user_id = ?`,
            [req.user.id]
        );

        // Get total requests (all time) from logs
        const [logStats] = await pool.query(
            `SELECT COUNT(*) as total_requests 
             FROM api_logs al 
             JOIN api_keys ak ON al.api_key_id = ak.id 
             WHERE ak.user_id = ?`,
            [req.user.id]
        );

        // Get today's requests from logs
        const [todayStats] = await pool.query(
            `SELECT COUNT(*) as today_requests 
             FROM api_logs al 
             JOIN api_keys ak ON al.api_key_id = ak.id 
             WHERE ak.user_id = ? AND DATE(al.created_at) = CURDATE()`,
            [req.user.id]
        );

        const activeKeys = keyStats[0].active_keys || 0;
        const usageLimit = activeKeys * 100; // 100 per active key
        const todayUsage = todayStats[0].today_requests || 0;

        res.json({
            success: true,
            data: {
                total_keys: keyStats[0].total_keys || 0,
                active_keys: activeKeys,
                today_usage: todayUsage,
                usage_limit: usageLimit,
                total_requests: logStats[0].total_requests || 0
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /user/activity
 * Get recent API activity logs for the user
 */
router.get('/activity', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, from_date, to_date } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let conditions = ['ak.user_id = ?'];
        let params = [req.user.id];

        // Date filters
        if (from_date) {
            conditions.push('DATE(al.created_at) >= ?');
            params.push(from_date);
        }
        if (to_date) {
            conditions.push('DATE(al.created_at) <= ?');
            params.push(to_date);
        }

        const whereClause = conditions.join(' AND ');

        // Get total count
        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total 
             FROM api_logs al 
             JOIN api_keys ak ON al.api_key_id = ak.id 
             WHERE ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get activity logs
        const [logs] = await pool.query(
            `SELECT 
                al.id,
                al.endpoint,
                al.method,
                al.status_code,
                al.response_time,
                al.ip_address,
                al.created_at,
                ak.name as api_key_name
             FROM api_logs al 
             JOIN api_keys ak ON al.api_key_id = ak.id 
             WHERE ${whereClause}
             ORDER BY al.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limitNum, offset]
        );

        res.json({
            success: true,
            data: logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                total_pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
