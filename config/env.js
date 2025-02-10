import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  SERVER_URL,
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_CLUSTER,
  DB_HOST,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_TOKEN,
  QSTASH_URL,
  EMAIL_ACCOUNT,
  EMAIL_PASSWORD,
} = process.env;
