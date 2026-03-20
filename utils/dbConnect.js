import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'mern-isp-portal';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Function to redact credentials in logs
const redactMongoUri = uri => uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');

const uriHasDbName = (uri) => {
  const noQuery = (uri || '').split('?')[0] || '';
  const schemeIndex = noQuery.indexOf('://');
  const afterScheme = schemeIndex >= 0 ? noQuery.slice(schemeIndex + 3) : noQuery;
  const firstSlash = afterScheme.indexOf('/');
  if (firstSlash < 0) return false;
  const path = afterScheme.slice(firstSlash + 1);
  return path.length > 0;
};

// Cached connection for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...(uriHasDbName(MONGODB_URI) ? {} : { dbName: MONGODB_DBNAME }),
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        const target = MONGODB_URI.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB';
        console.log(`[OK] Connected to ${target}: ${redactMongoUri(MONGODB_URI)}`);
        return mongoose;
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
