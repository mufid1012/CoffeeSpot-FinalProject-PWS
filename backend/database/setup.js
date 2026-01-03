const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔧 Setting up CoffeeSpot database...\n');

    // Create connection without database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        // Read and execute schema
        console.log('📋 Creating database schema...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await connection.query(schema);
        console.log('✅ Schema created successfully\n');

        // Hash passwords properly for seed data
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        // Select database
        await connection.query(`USE ${process.env.DB_NAME || 'coffeespot_db'}`);

        // Check if data already exists
        const [users] = await connection.query('SELECT COUNT(*) as count FROM users');

        if (users[0].count === 0) {
            console.log('🌱 Seeding initial data...');

            // Insert admin user
            await connection.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@coffeespot.id', adminPassword, 'admin']
            );

            // Insert demo user
            await connection.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['developer', 'dev@example.com', userPassword, 'user']
            );

            // Read and execute seed data (minus users which we handled above)
            const seedPath = path.join(__dirname, 'seed.sql');
            let seedData = fs.readFileSync(seedPath, 'utf8');

            // Remove user inserts from seed (we already did them with proper hashing)
            seedData = seedData.replace(/INSERT INTO users.*?;/gs, '');

            // Execute remaining seed data
            await connection.query(seedData);

            console.log('✅ Seed data inserted successfully\n');
        } else {
            console.log('ℹ️  Data already exists, skipping seed\n');
        }

        console.log('╔═══════════════════════════════════════════════╗');
        console.log('║     Database setup completed successfully!    ║');
        console.log('╠═══════════════════════════════════════════════╣');
        console.log('║  Default credentials:                         ║');
        console.log('║  Admin: admin@coffeespot.id / admin123        ║');
        console.log('║  User:  dev@example.com / user123             ║');
        console.log('╚═══════════════════════════════════════════════╝');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

setupDatabase().catch(console.error);
