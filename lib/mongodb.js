const mongoose = require('mongoose');

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  const globalForMongo = globalThis;
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
