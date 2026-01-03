const express = require('express');
const { pool } = require('../config/database');
const { apiKeyMiddleware } = require('../middleware/apiKeyMiddleware');
const { logMiddleware } = require('../middleware/logMiddleware');

const router = express.Router();

// Apply API key middleware to all routes
router.use(apiKeyMiddleware);
router.use(logMiddleware);

/**
 * GET /api/coffeeshops
 * List coffee shops with filtering and pagination
 */
router.get('/coffeeshops', async (req, res, next) => {
    try {
        const { city, category_id, facility_id, search, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT DISTINCT c.*, cat.name as category_name
            FROM coffeeshops c
            LEFT JOIN categories cat ON c.category_id = cat.id
        `;
        let countQuery = 'SELECT COUNT(DISTINCT c.id) as total FROM coffeeshops c';
        const params = [];
        const conditions = [];

        // Join facilities if filtering by facility
        if (facility_id) {
            query = `
                SELECT DISTINCT c.*, cat.name as category_name
                FROM coffeeshops c
                LEFT JOIN categories cat ON c.category_id = cat.id
                JOIN coffeeshop_facilities cf ON c.id = cf.coffeeshop_id
            `;
            countQuery = `
                SELECT COUNT(DISTINCT c.id) as total 
                FROM coffeeshops c
                JOIN coffeeshop_facilities cf ON c.id = cf.coffeeshop_id
            `;
            conditions.push('cf.facility_id = ?');
            params.push(facility_id);
        }

        // Apply filters
        if (city) {
            conditions.push('c.city = ?');
            params.push(city);
        }
        if (category_id) {
            conditions.push('c.category_id = ?');
            params.push(category_id);
        }
        if (search) {
            conditions.push('(c.name LIKE ? OR c.address LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // Add ordering and pagination
        query += ' ORDER BY c.rating DESC, c.name ASC LIMIT ? OFFSET ?';

        // Get total count
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Get data
        const [coffeeshops] = await pool.query(query, [...params, limitNum, offset]);

        // Get facilities for each coffeeshop
        for (let shop of coffeeshops) {
            const [facilities] = await pool.query(
                `SELECT f.id, f.name, f.icon 
                 FROM facilities f 
                 JOIN coffeeshop_facilities cf ON f.id = cf.facility_id 
                 WHERE cf.coffeeshop_id = ?`,
                [shop.id]
            );
            shop.facilities = facilities;
            shop.category = shop.category_name ? { id: shop.category_id, name: shop.category_name } : null;
            delete shop.category_name;
        }

        res.json({
            success: true,
            data: coffeeshops,
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

/**
 * GET /api/coffeeshops/:id
 * Get single coffee shop by ID
 */
router.get('/coffeeshops/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const [coffeeshops] = await pool.query(
            `SELECT c.*, cat.name as category_name, cat.description as category_description
             FROM coffeeshops c
             LEFT JOIN categories cat ON c.category_id = cat.id
             WHERE c.id = ?`,
            [id]
        );

        if (coffeeshops.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Coffee shop not found'
                }
            });
        }

        const shop = coffeeshops[0];

        // Get facilities
        const [facilities] = await pool.query(
            `SELECT f.id, f.name, f.icon 
             FROM facilities f 
             JOIN coffeeshop_facilities cf ON f.id = cf.facility_id 
             WHERE cf.coffeeshop_id = ?`,
            [id]
        );

        shop.facilities = facilities;
        shop.category = shop.category_name ? {
            id: shop.category_id,
            name: shop.category_name,
            description: shop.category_description
        } : null;
        delete shop.category_name;
        delete shop.category_description;

        res.json({
            success: true,
            data: shop
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/categories
 * List all categories
 */
router.get('/categories', async (req, res, next) => {
    try {
        const [categories] = await pool.query(
            'SELECT id, name, description FROM categories ORDER BY name'
        );

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/facilities
 * List all facilities
 */
router.get('/facilities', async (req, res, next) => {
    try {
        const [facilities] = await pool.query(
            'SELECT id, name, icon FROM facilities ORDER BY name'
        );

        res.json({
            success: true,
            data: facilities
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/cities
 * List cities with coffee shop count
 */
router.get('/cities', async (req, res, next) => {
    try {
        const [cities] = await pool.query(
            `SELECT city as name, COUNT(*) as count 
             FROM coffeeshops 
             GROUP BY city 
             ORDER BY count DESC`
        );

        res.json({
            success: true,
            data: cities
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
