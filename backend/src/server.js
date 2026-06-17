import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { healthRouter } from "./routes/health.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use("/api", healthRouter);

app.listen(config.port, () => {
  console.log(`LEIDER ecommerce API running on http://localhost:${config.port}`);
});
