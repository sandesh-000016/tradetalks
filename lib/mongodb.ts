import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

// Connection options tuned for low-latency production use
const mongoOptions: MongoClientOptions = {
  maxPoolSize: 10,          // Max connections in pool
  minPoolSize: 1,           // Keep 1 connection warm to avoid cold starts
  serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas is unreachable (5s)
  connectTimeoutMS: 10000,  // Max time to establish connection
  socketTimeoutMS: 30000,   // Max time for a socket operation
  compressors: ["zlib"],    // Compress data in transit between app and MongoDB
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, mongoOptions);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, mongoOptions);
    clientPromise = client.connect();
  }
} else {
  console.warn("MONGODB_URI environment variable is missing. MongoDB operations will be bypassed gracefully.");
}

export default clientPromise;
