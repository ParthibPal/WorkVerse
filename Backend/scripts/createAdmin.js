// Script to create an admin user
// Run this script to add an admin user to the database
// Usage: node scripts/createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

/**
 * Create admin user function
 * This function creates a new admin user with proper privileges
 * Uses the secure admin creation method from the User model
 */
async function createAdminUser() {
    try {
        // Connect to MongoDB
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workverse';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Admin user data
        const adminData = {
            name: 'Admin User',
            email: 'admin@workverse.com',
            password: 'admin123456', // Change this to a secure password
            adminLevel: 'super_admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('❌ Admin user already exists with this email');
            console.log('Admin details:', {
                name: existingAdmin.name,
                email: existingAdmin.email,
                userType: existingAdmin.userType,
                isAdmin: existingAdmin.isAdmin,
                adminLevel: existingAdmin.adminLevel
            });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user using the secure static method
        const adminUser = await User.createAdmin({
            ...adminData,
            password: hashedPassword
        });

        console.log('✅ Admin user created successfully!');
        console.log('Admin details:', {
            name: adminUser.name,
            email: adminUser.email,
            userType: adminUser.userType,
            isAdmin: adminUser.isAdmin,
            adminLevel: adminUser.adminLevel
        });
        console.log('\n🔐 Login credentials:');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');
        console.log('\n🔒 Security Notes:');
        console.log('- Admin users can only be created through this script');
        console.log('- Regular registration forms cannot create admin users');
        console.log('- Admin privileges are protected at multiple levels');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        
        // Handle specific admin creation errors
        if (error.name === 'AdminCreationError') {
            console.error('🔒 Security Error: Admin creation blocked by security middleware');
        } else if (error.name === 'ValidationError') {
            console.error('📝 Validation Error: Please check the admin data format');
        } else if (error.code === 11000) {
            console.error('📧 Duplicate Error: Admin with this email already exists');
        }
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the script
if (require.main === module) {
    createAdminUser();
}

module.exports = createAdminUser; 