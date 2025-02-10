import mongoose from "mongoose";
import {
  DB_USER,
  DB_PASSWORD,
  DB_CLUSTER,
  DB_HOST,
  NODE_ENV,
  DB_NAME,
} from "../config/env.js";

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_CLUSTER}`;

const database_connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    if (NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

    await mongoose.connect(DB_URI);
    console.log(`✅ Established connection with ${NODE_ENV} database`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export default database_connect;
