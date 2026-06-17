import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://fernando:ONtERc,=,48@localhost:5432/leideferdbdev",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
