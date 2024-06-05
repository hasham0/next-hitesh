import { ConnectionObject } from "@/types";
import mongoose from "mongoose";
import { env } from "./env";

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connted to database");
    return;
  }
  try {
    const db = await mongoose.connect(env.MONGODB_URI || "", {
      dbName: "nextjs_ai",
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("🚀 ~ dbConnection ~ error:", error);
    process.exit(1);
  }
}

export default dbConnection;
