require('dotenv').config();
console.log('🔗 MONGODB_URI from env:', process.env.MONGODB_URI);
console.log('🔗 All env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
