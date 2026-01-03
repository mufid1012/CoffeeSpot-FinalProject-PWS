const { pool } = require('../config/database');

/**
 * Validate API Key from x-api-key header
 * Also handles rate limiting per API key
 */
const apiKeyMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'API key is required. Provide x-api-key header.'
                }
            });
        }

        // Get API key from database
        const [apiKeys] = await pool.query(
            `SELECT ak.*, u.username, u.email 
             FROM api_keys ak 
             JOIN users u ON ak.user_id = u.id 
             WHERE ak.api_key = ?`,
            [apiKey]
        );

        if (apiKeys.length === 0) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid API key'
                }
            });
        }

        const keyData = apiKeys[0];

        // Check if key is revoked
        if (keyData.status === 'revoked') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'API_KEY_REVOKED',
                    message: 'This API key has been revoked'
                }
            });
        }

        // Count today's usage from api_logs (source of truth)
        const [usageResult] = await pool.query(
            `SELECT COUNT(*) as today_usage 
             FROM api_logs 
             WHERE api_key_id = ? AND DATE(created_at) = CURDATE()`,
            [keyData.id]
        );
        const todayUsage = usageResult[0].today_usage || 0;

        // Check rate limit
        if (todayUsage >= keyData.usage_limit) {
            return res.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: `Rate limit exceeded. Limit: ${keyData.usage_limit} requests per day. Used: ${todayUsage}.`
                }
            });
        }

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', keyData.usage_limit);
        res.setHeader('X-RateLimit-Remaining', keyData.usage_limit - todayUsage - 1);
        res.setHeader('X-RateLimit-Reset', Math.floor(new Date().setHours(24, 0, 0, 0) / 1000));

        // Attach API key info to request (for logging)
        req.apiKey = keyData;
        req.apiKey.current_usage = todayUsage;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { apiKeyMiddleware };

