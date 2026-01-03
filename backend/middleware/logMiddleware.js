const { pool } = require('../config/database');

/**
 * Log API requests to database
 */
const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();

    // Capture original end function
    const originalEnd = res.end;

    res.end = function (...args) {
        const responseTime = Date.now() - startTime;

        // Log to database asynchronously
        logRequest(req, res.statusCode, responseTime).catch(err => {
            console.error('Failed to log request:', err.message);
        });

        originalEnd.apply(res, args);
    };

    next();
};

async function logRequest(req, statusCode, responseTime) {
    if (!req.apiKey) return;

    try {
        await pool.query(
            `INSERT INTO api_logs (api_key_id, endpoint, method, status_code, ip_address, user_agent, response_time)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.apiKey.id,
                req.originalUrl,
                req.method,
                statusCode,
                req.ip || req.connection.remoteAddress,
                req.get('User-Agent') || '',
                responseTime
            ]
        );
    } catch (error) {
        // Silently fail - logging should not affect the request
    }
}

module.exports = { logMiddleware };
