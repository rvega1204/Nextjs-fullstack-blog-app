import mongoose from "mongoose";

/**
 * connectDB connects to the MongoDB database.
 * It uses a global variable to cache the connection.
 * If the connection is already cached, it returns the cached connection.
 * If the connection is not cached, it creates a new connection and caches it.
 * @returns {Promise<Mongoose>} The MongoDB connection.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(process.env.MONGODB_URI)
        .then((mongoose) => {
          return mongoose;
        });
    }

    cached.conn = await cached.promise;
    console.log(`MongoDB connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
