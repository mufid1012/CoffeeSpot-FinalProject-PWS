const express = require('express');
const { pool } = require('../config/database');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(isAdmin);

// ========================
// Dashboard Stats
// ========================

/**
 * GET /admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', async (req, res, next) => {
    try {
        // Coffee shops count
        const [shopCount] = await pool.query('SELECT COUNT(*) as count FROM coffeeshops');

        // Users count
        const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");

        // Active API keys
        const [keyCount] = await pool.query("SELECT COUNT(*) as count FROM api_keys WHERE status = 'active'");

        // Today's requests
        const [todayRequests] = await pool.query(
            "SELECT COUNT(*) as count FROM api_logs WHERE DATE(created_at) = CURDATE()"
        );

        res.json({
            success: true,
            data: {
                total_coffeeshops: shopCount[0].count,
                total_users: userCount[0].count,
                active_api_keys: keyCount[0].count,
                today_requests: todayRequests[0].count
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/stats/chart
 * Get API usage for last 7 days
 */
router.get('/stats/chart', async (req, res, next) => {
    try {
        const [results] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM api_logs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Fill in missing days with 0
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const found = results.find(r => r.date.toISOString().split('T')[0] === dateStr);
            last7Days.push({
                date: dateStr,
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                count: found ? found.count : 0
            });
        }

        res.json({ success: true, data: last7Days });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/stats/endpoints
 * Get top endpoints by request count
 */
router.get('/stats/endpoints', async (req, res, next) => {
    try {
        const [results] = await pool.query(`
            SELECT 
                endpoint,
                method,
                COUNT(*) as request_count,
                AVG(response_time) as avg_response_time,
                SUM(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 ELSE 0 END) as success_count,
                COUNT(*) as total_count
            FROM api_logs
            WHERE DATE(created_at) = CURDATE()
            GROUP BY endpoint, method
            ORDER BY request_count DESC
            LIMIT 10
        `);

        const endpoints = results.map(r => ({
            endpoint: r.endpoint,
            method: r.method,
            requests: r.request_count,
            avg_response_time: Math.round(r.avg_response_time || 0),
            success_rate: r.total_count > 0
                ? ((r.success_count / r.total_count) * 100).toFixed(1)
                : '100.0'
        }));

        res.json({ success: true, data: endpoints });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/stats/recent
 * Get recent API logs for activity feed
 */
router.get('/stats/recent', async (req, res, next) => {
    try {
        const [logs] = await pool.query(`
            SELECT al.*, ak.api_key, ak.name as key_name
            FROM api_logs al
            LEFT JOIN api_keys ak ON al.api_key_id = ak.id
            ORDER BY al.created_at DESC
            LIMIT 10
        `);

        res.json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/cities
 * Get list of cities from coffee shops
 */
router.get('/cities', async (req, res, next) => {
    try {
        const [cities] = await pool.query(
            `SELECT city as name, COUNT(*) as count 
             FROM coffeeshops 
             GROUP BY city 
             ORDER BY count DESC`
        );

        res.json({ success: true, data: cities });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/logs/endpoints
 * Get unique endpoints for filter dropdown
 */
router.get('/logs/endpoints', async (req, res, next) => {
    try {
        const [endpoints] = await pool.query(`
            SELECT endpoint, COUNT(*) as count
            FROM api_logs
            GROUP BY endpoint
            ORDER BY count DESC
            LIMIT 50
        `);

        res.json({ success: true, data: endpoints });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/logs
 * Get API logs with filtering and pagination
 */
router.get('/logs', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, date, endpoint, status, api_key } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT al.*, ak.api_key, ak.name as key_name
            FROM api_logs al
            LEFT JOIN api_keys ak ON al.api_key_id = ak.id
        `;
        const conditions = [];
        const params = [];

        // Date filter
        if (date) {
            conditions.push('DATE(al.created_at) = ?');
            params.push(date);
        }

        // Endpoint filter
        if (endpoint) {
            conditions.push('al.endpoint LIKE ?');
            params.push(`%${endpoint}%`);
        }

        // Status filter (2xx, 4xx, 5xx)
        if (status === '2xx') {
            conditions.push('al.status_code >= 200 AND al.status_code < 300');
        } else if (status === '4xx') {
            conditions.push('al.status_code >= 400 AND al.status_code < 500');
        } else if (status === '5xx') {
            conditions.push('al.status_code >= 500');
        }

        // API Key filter
        if (api_key) {
            conditions.push('ak.api_key LIKE ?');
            params.push(`%${api_key}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';

        const [logs] = await pool.query(query, [...params, limitNum, offset]);

        // Get stats for today
        const [statsResult] = await pool.query(`
            SELECT 
                COUNT(*) as today_requests,
                AVG(response_time) as avg_response_time,
                SUM(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors_today
            FROM api_logs
            WHERE DATE(created_at) = CURDATE()
        `);

        const stats = statsResult[0];
        const successRate = stats.today_requests > 0
            ? ((stats.success_count / stats.today_requests) * 100).toFixed(1)
            : '100.0';

        res.json({
            success: true,
            data: logs,
            stats: {
                today_requests: stats.today_requests || 0,
                success_rate: successRate,
                avg_response_time: Math.round(stats.avg_response_time || 0),
                errors_today: stats.errors_today || 0
            }
        });
    } catch (error) {
        next(error);
    }
});

// ========================
// Coffee Shops CRUD
// ========================

/**
 * GET /admin/coffeeshops
 * Get all coffee shops (admin view with more details)
 */
router.get('/coffeeshops', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, city, category_id } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT c.*, cat.name as category_name
            FROM coffeeshops c
            LEFT JOIN categories cat ON c.category_id = cat.id
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM coffeeshops c';
        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(c.name LIKE ? OR c.address LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (city) {
            conditions.push('c.city = ?');
            params.push(city);
        }
        if (category_id) {
            conditions.push('c.category_id = ?');
            params.push(category_id);
        }

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        query += ' ORDER BY c.id DESC LIMIT ? OFFSET ?';

        const [countResult] = await pool.query(countQuery, params);
        const [coffeeshops] = await pool.query(query, [...params, limitNum, offset]);

        res.json({
            success: true,
            data: coffeeshops,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: countResult[0].total,
                total_pages: Math.ceil(countResult[0].total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/coffeeshops/:id
 * Get single coffee shop for editing
 */
router.get('/coffeeshops/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const [coffeeshops] = await pool.query(
            'SELECT * FROM coffeeshops WHERE id = ?',
            [id]
        );

        if (coffeeshops.length === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Coffee shop not found' }
            });
        }

        // Get facilities
        const [facilities] = await pool.query(
            'SELECT facility_id FROM coffeeshop_facilities WHERE coffeeshop_id = ?',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...coffeeshops[0],
                facilities: facilities.map(f => f.facility_id)
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /admin/coffeeshops
 * Create a new coffee shop
 */
router.post('/coffeeshops', async (req, res, next) => {
    try {
        const {
            name, description, address, city, latitude, longitude,
            open_time, close_time, category_id, rating, image_url, facilities
        } = req.body;

        if (!name || !address || !city) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Name, address and city are required' }
            });
        }

        const [result] = await pool.query(
            `INSERT INTO coffeeshops 
             (name, description, address, city, latitude, longitude, open_time, close_time, category_id, rating, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, address, city, latitude, longitude, open_time, close_time, category_id, rating || 0, image_url]
        );

        // Add facilities
        if (facilities && facilities.length > 0) {
            const facilityValues = facilities.map(f => [result.insertId, f]);
            await pool.query(
                'INSERT INTO coffeeshop_facilities (coffeeshop_id, facility_id) VALUES ?',
                [facilityValues]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Coffee shop created',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /admin/coffeeshops/:id
 * Update a coffee shop
 */
router.put('/coffeeshops/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name, description, address, city, latitude, longitude,
            open_time, close_time, category_id, rating, image_url, facilities
        } = req.body;

        await pool.query(
            `UPDATE coffeeshops SET 
             name = ?, description = ?, address = ?, city = ?, 
             latitude = ?, longitude = ?, open_time = ?, close_time = ?,
             category_id = ?, rating = ?, image_url = ?
             WHERE id = ?`,
            [name, description, address, city, latitude, longitude, open_time, close_time, category_id, rating, image_url, id]
        );

        // Update facilities
        await pool.query('DELETE FROM coffeeshop_facilities WHERE coffeeshop_id = ?', [id]);
        if (facilities && facilities.length > 0) {
            const facilityValues = facilities.map(f => [id, f]);
            await pool.query(
                'INSERT INTO coffeeshop_facilities (coffeeshop_id, facility_id) VALUES ?',
                [facilityValues]
            );
        }

        res.json({
            success: true,
            message: 'Coffee shop updated'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /admin/coffeeshops/:id
 * Delete a coffee shop
 */
router.delete('/coffeeshops/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM coffeeshops WHERE id = ?', [id]);
        res.json({ success: true, message: 'Coffee shop deleted' });
    } catch (error) {
        next(error);
    }
});

// ========================
// Categories CRUD
// ========================

router.get('/categories', async (req, res, next) => {
    try {
        const [categories] = await pool.query(
            `SELECT c.*, COUNT(cs.id) as coffeeshop_count 
             FROM categories c 
             LEFT JOIN coffeeshops cs ON c.id = cs.category_id 
             GROUP BY c.id 
             ORDER BY c.name`
        );
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
});

router.post('/categories', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Name is required' }
            });
        }
        const [result] = await pool.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (error) {
        next(error);
    }
});

router.put('/categories/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        await pool.query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        res.json({ success: true, message: 'Category updated' });
    } catch (error) {
        next(error);
    }
});

router.delete('/categories/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
});

// ========================
// Facilities CRUD
// ========================

router.get('/facilities', async (req, res, next) => {
    try {
        const [facilities] = await pool.query(
            `SELECT f.*, COUNT(cf.coffeeshop_id) as usage_count 
             FROM facilities f 
             LEFT JOIN coffeeshop_facilities cf ON f.id = cf.facility_id 
             GROUP BY f.id 
             ORDER BY f.name`
        );
        res.json({ success: true, data: facilities });
    } catch (error) {
        next(error);
    }
});

router.post('/facilities', async (req, res, next) => {
    try {
        const { name, icon } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Name is required' }
            });
        }
        const [result] = await pool.query(
            'INSERT INTO facilities (name, icon) VALUES (?, ?)',
            [name, icon]
        );
        res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (error) {
        next(error);
    }
});

router.put('/facilities/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        await pool.query(
            'UPDATE facilities SET name = ?, icon = ? WHERE id = ?',
            [name, icon, id]
        );
        res.json({ success: true, message: 'Facility updated' });
    } catch (error) {
        next(error);
    }
});

router.delete('/facilities/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
        res.json({ success: true, message: 'Facility deleted' });
    } catch (error) {
        next(error);
    }
});

// ========================
// Users Management
// ========================

router.get('/users', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT u.id, u.username, u.email, u.role, u.created_at,
                   COUNT(DISTINCT ak.id) as api_key_count,
                   SUM(CASE WHEN ak.status = 'active' THEN 1 ELSE 0 END) as active_keys,
                   COALESCE(SUM(al_count.request_count), 0) as total_requests
            FROM users u
            LEFT JOIN api_keys ak ON u.id = ak.user_id
            LEFT JOIN (
                SELECT api_key_id, COUNT(*) as request_count FROM api_logs GROUP BY api_key_id
            ) al_count ON ak.id = al_count.api_key_id
        `;
        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(u.username LIKE ? OR u.email LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (role) {
            conditions.push('u.role = ?');
            params.push(role);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';

        const [users] = await pool.query(query, [...params, limitNum, offset]);
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');

        res.json({
            success: true,
            data: users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: countResult[0].total,
                total_pages: Math.ceil(countResult[0].total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
});

router.get('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const [users] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            });
        }

        const [apiKeys] = await pool.query(
            `SELECT ak.*, 
                    (SELECT COUNT(*) FROM api_logs WHERE api_key_id = ak.id) as total_requests
             FROM api_keys ak 
             WHERE ak.user_id = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...users[0],
                api_keys: apiKeys
            }
        });
    } catch (error) {
        next(error);
    }
});

// ========================
// API Logs
// ========================

router.get('/logs', async (req, res, next) => {
    try {
        const { page = 1, limit = 50, date, endpoint, status, api_key } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT al.*, ak.api_key, ak.name as key_name
            FROM api_logs al
            LEFT JOIN api_keys ak ON al.api_key_id = ak.id
        `;
        const params = [];
        const conditions = [];

        if (date) {
            conditions.push('DATE(al.created_at) = ?');
            params.push(date);
        }
        if (endpoint) {
            conditions.push('al.endpoint LIKE ?');
            params.push(`%${endpoint}%`);
        }
        if (status) {
            if (status === '2xx') conditions.push('al.status_code >= 200 AND al.status_code < 300');
            else if (status === '4xx') conditions.push('al.status_code >= 400 AND al.status_code < 500');
            else if (status === '5xx') conditions.push('al.status_code >= 500');
        }
        if (api_key) {
            conditions.push('ak.api_key LIKE ?');
            params.push(`%${api_key}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';

        const [logs] = await pool.query(query, [...params, limitNum, offset]);

        // Get stats
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total_today,
                AVG(response_time) as avg_response_time,
                SUM(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
            FROM api_logs 
            WHERE DATE(created_at) = CURDATE()
        `);

        res.json({
            success: true,
            data: logs,
            stats: {
                today_requests: stats[0].total_today || 0,
                avg_response_time: Math.round(stats[0].avg_response_time || 0),
                success_rate: stats[0].total_today > 0
                    ? ((stats[0].success_count / stats[0].total_today) * 100).toFixed(1)
                    : 100,
                errors_today: stats[0].error_count || 0
            },
            pagination: {
                page: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        next(error);
    }
});

// ========================
// Users Management
// ========================

/**
 * GET /admin/users
 * Get all users with pagination
 */
router.get('/users', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT u.*, 
                   COUNT(DISTINCT ak.id) as api_key_count,
                   COALESCE(SUM(
                       (SELECT COUNT(*) FROM api_logs WHERE api_key_id = ak.id)
                   ), 0) as total_requests
            FROM users u
            LEFT JOIN api_keys ak ON u.id = ak.user_id AND ak.status = 'active'
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM users';
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push('(u.username LIKE ? OR u.email LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (role) {
            conditions.push('u.role = ?');
            params.push(role);
        }

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';

        const [countResult] = await pool.query(countQuery, params);
        const [users] = await pool.query(query, [...params, limitNum, offset]);

        res.json({
            success: true,
            data: users.map(u => ({ ...u, password: undefined })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: countResult[0].total,
                total_pages: Math.ceil(countResult[0].total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /admin/users/:id
 * Get user details with API keys
 */
router.get('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const [users] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Get API keys with usage stats
        const [apiKeys] = await pool.query(`
            SELECT ak.id, ak.name, ak.status, ak.created_at,
                   (SELECT COUNT(*) FROM api_logs WHERE api_key_id = ak.id) as total_requests
            FROM api_keys ak
            WHERE ak.user_id = ?
            ORDER BY ak.created_at DESC
        `, [id]);

        // Get total requests
        const [totalReq] = await pool.query(`
            SELECT COUNT(*) as total
            FROM api_logs al
            JOIN api_keys ak ON al.api_key_id = ak.id
            WHERE ak.user_id = ?
        `, [id]);

        res.json({
            success: true,
            data: {
                ...user,
                api_keys: apiKeys,
                total_requests: totalReq[0].total || 0
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

