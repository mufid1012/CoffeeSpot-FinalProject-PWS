const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.log('⚠️  Server starting without database connection');
        console.log('   Make sure MySQL is running and database is configured');
    }

    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════╗
║          CoffeeSpot API Server                ║
╠═══════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}               ║
║  📍 http://localhost:${PORT}                     ║
║  📖 API Docs: http://localhost:${PORT}/docs      ║
╚═══════════════════════════════════════════════╝
        `);
    });
};

startServer();
