// Load environment variables first to ensure MONGO_URI is available
require('dotenv').config();

// Import mongoose for MongoDB connection
const mongoose = require('mongoose');

// Debug: Check environment variable loading
console.log('=== DATABASE CONNECTION DEBUG ===');
console.log('process.env.MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('process.env.MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);
console.log('process.env.MONGO_URI starts with:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) : 'NOT SET');

// MongoDB connection string
// Use environment variable if available, otherwise fallback to local MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workverse';

console.log('Final MONGO_URI being used:', MONGO_URI.substring(0, 50) + '...');
console.log('================================');

/**
 * Connect to MongoDB database
 * This function establishes a connection to MongoDB using mongoose
 * It includes error handling and connection status logging
 */
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Using URI:', MONGO_URI.substring(0, 50) + '...');
        
        // Establish connection to MongoDB
        // Mongoose will automatically handle connection pooling and reconnection
        const conn = await mongoose.connect(MONGO_URI);
        
        // Log successful connection details
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`📁 Collection: WorkVerse`);
        
    } catch (error) {
        // Log detailed error information
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('Full error:', error);
        
        // Exit the process if database connection fails
        // This prevents the app from running without a database
        process.exit(1);
    }
};

// Export the connection function
module.exports = connectDB; 
