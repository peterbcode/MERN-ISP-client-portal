const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-isp-portal';

async function forceCreateAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing admin user if exists
    await User.deleteOne({ email: 'admin@valleyinternet.com' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@valleyinternet.com',
      password: hashedPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@valleyinternet.com');
    console.log('🔑 Password: admin123');
    console.log('🌐 Login at: http://localhost:3000/login');
    
    // Verify creation
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

forceCreateAdmin();
