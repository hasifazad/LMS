const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const logger = require('./utils/logger');

dotenv.config(); // Load environment variables

const app = express();


//  Middleware
app.use(express.json());
app.use(cors());


//  Logger Middleware (Morgan + Winston)
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream })); // Write logs to a file
app.use(morgan('dev')); // Log requests to console




const connectMainDB = async () => {
    try {
        const connection = await mongoose.connect('mongodb://localhost:27017/');
        console.log('✅ Connected to Main DB');
        return connection;
    } catch (error) {
        console.error('❌ Main DB connection failed:');

    }
};
connectMainDB()

// setInterval(async () => {
//     console.log("State:", mongoose.connection.readyState);

//     try {
//         const adminDb = mongoose.connection.db.admin();
//         const status = await adminDb.serverStatus();

//         console.log("Connections:", status.connections);
//     } catch (err) {
//         console.log("Error fetching connections:", err.message);
//     }

// }, 2000);



//  import database Middleware
const databaseMiddleware = require('./middlewares/database.middleware');


//  Load Models First
require("./models/staff.model");
require("./models/student.model");


//  Import Routes
const staffRoutes = require('./routes/staff.routes');
const studentRoutes = require('./routes/student.routes');
const batchRoutes = require('./routes/batch.routes');
const courseRoutes = require('./routes/course.routes');
const organisationRoutes = require('./routes/organisation.routes');
const adminRoutes = require('./routes/admin.routes');



// Don't move this route - Caution!!!
app.use('/api/v1/organisation', organisationRoutes);

app.use(databaseMiddleware);

// ✅ Use Routes
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/batch', batchRoutes);
app.use('/api/v1/course', courseRoutes);

app.use('/api/v1/admin', adminRoutes);



app.get('/test', (req, res) => {

    res.send('hello from server')

})


// Replace with your MongoDB connection string (local or MongoDB Atlas)
// const uri = 'mongodb://localhost:27017/org1db'; // For local
// const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority'; // For MongoDB Atlas

// Connect to MongoDB
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB successfully!');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });


// app.use('/org', organisationRoutes);
// Apply the database middleware globally




// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`❌ Error: ${err.message}`);

    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'SERVER_ERROR',
            message: err.message || 'An unexpected error occurred.'
        }
    });
});



//  Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ HTTPS Server (Optional)
// if (process.env.USE_HTTPS === "true") {
//     const options = {
//         key: fs.readFileSync('./src/key.pem'),
//         cert: fs.readFileSync('./src/cert.pem')
//     };

//     https.createServer(options, app).listen(PORT, () => {
//         console.log(`🔒 HTTPS Server running on port ${PORT}`);
//     });
// }
