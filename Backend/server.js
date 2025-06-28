// Import required dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Check if environment variables are loaded properly
console.log('Environment check:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI value:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('MONGO_URI preview:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'NOT SET');

// Connect to MongoDB database
connectDB();

// CORS configuration - Allow multiple origins for development
// This prevents cross-origin request issues between frontend and backend
const allowedOrigins = [
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Alternative Vite port
    'http://localhost:3000', // React default port
    'http://localhost:3001'  // Alternative React port
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if the request origin is in our allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
// Mount authentication routes under /api/auth prefix
app.use('/api/auth', require('./routes/auth'));

// Basic welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to WorkVerse API" });
});

// Health check route for monitoring server status
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Global error handling middleware
// This catches any errors thrown in the application
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - Catch all unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
});
