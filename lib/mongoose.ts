import mongoose, { type Mongoose } from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing environment variable: MONGODB_URI");
  return uri;
}

function uriHasDbName(uri: string): boolean {
  const noQuery = uri.split("?")[0] ?? uri;
  const schemeIndex = noQuery.indexOf("://");
  const afterScheme = schemeIndex >= 0 ? noQuery.slice(schemeIndex + 3) : noQuery;
  const firstSlash = afterScheme.indexOf("/");
  if (firstSlash < 0) return false;
  const path = afterScheme.slice(firstSlash + 1);
  return path.length > 0;
}

// Function to redact credentials in logs
const redactMongoUri = (uri: string) => uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? (globalThis.mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = getMongoUri();
    const needsDbName = !uriHasDbName(uri);
    const dbName = (process.env.MONGODB_DBNAME || "mern-isp-portal").trim();

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        ...(needsDbName ? { dbName } : {}),
      })
      .then((mongoose) => {
        const target = uri.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB';
        console.log(`[OK] Connected to ${target}: ${redactMongoUri(uri)}`);
        return mongoose;
      })
      .catch((err) => {
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

export default connectDB;
