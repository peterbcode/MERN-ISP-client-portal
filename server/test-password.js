const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/mern-isp-portal';

async function testPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find admin user
    const user = await User.findOne({ email: 'admin@valleyinternet.com' }).select('+password');
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found');
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Password hash exists: ${!!user.password}`);
    console.log(`🔑 Password hash length: ${user.password?.length}`);
    
    // Test password comparison
    const testPassword = 'admin123';
    console.log(`\n🧪 Testing password: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`✅ Password match: ${isMatch}`);
    
    if (!isMatch) {
      console.log('❌ Password does not match!');
      console.log('🔧 Creating new password hash...');
      
      // Create new hash
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log(`🔑 New hash length: ${newHash.length}`);
      
      // Update user password
      await User.updateOne(
        { email: 'admin@valleyinternet.com' },
        { $set: { password: newHash } }
      );
      
      console.log('✅ Password updated in database');
      
      // Test again
      const updatedUser = await User.findOne({ email: 'admin@valleyinternet.com' }).select('+password');
      const newMatch = await bcrypt.compare(testPassword, updatedUser.password);
      console.log(`✅ New password match: ${newMatch}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testPassword();
