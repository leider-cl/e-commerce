import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: requiredEnv("DATABASE_URL"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
