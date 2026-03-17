const mongoose = require('mongoose');

// Use the same connection as the server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-isp-portal';

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('🔗 Connection string:', MONGODB_URI);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(c => c.name));
    
    // Check if users collection exists and count documents
    if (collections.some(c => c.name === 'users')) {
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log('👥 Users in database:', userCount);
      
      // Find all users
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
      });
    } else {
      console.log('❌ No users collection found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
