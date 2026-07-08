import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexura"

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

// Ensure global cache is set up immediately
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

const cached: MongooseCache = global.mongoose

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null;
    throw e
  }

  return cached.conn
}
