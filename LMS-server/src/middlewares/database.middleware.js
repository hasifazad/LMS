let getDbConfig = require('../configs/database.config')

const mongoose = require('mongoose');
// Cache for database connections
const connections = {};

// Middleware to manage dynamic database connections
async function databaseMiddleware(req, res, next) {
    console.log(req.headers);

    try {
        // const orgCode = req.headers['x-organization-id']
        const orgCode = 'org1db'
        console.log(orgCode);


        if (!orgCode) {
            return res.status(400).send('Organization code is required');
        }

        // Check if the connection exists in the cache
        if (connections[orgCode]) {
            req.db = connections[orgCode]; // Attach the existing connection
            return next();
        }

        // Get the database config for the organization
        // const dbConfig = await getDbConfig(orgCode);
        // 'mongodb+srv://asifazad114:HHzs9blZd4gsNCqR@cluster0.ugptnol.mongodb.net/org1db'
        const dbConfig = process.env.MONGO_URI


        // Create a new connection
        const dbConnection = await mongoose.createConnection(dbConfig);

        // Cache the connection
        connections[orgCode] = dbConnection;

        // Attach the connection to the request object
        req.db = dbConnection;

        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Database connection failed');
    }
}

module.exports = databaseMiddleware;
