import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import "./config/passport.js";
import { config } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";
import { checkoutRouter } from "./routes/checkout.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", productsRouter);
app.use("/api", authRouter);
app.use("/api", checkoutRouter);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/?login=failed" }),
    (req, res) => {
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn },
      );
      res.redirect(`${config.corsOrigin}/?token=${token}`);
    },
  );
}

app.listen(config.port, () => {
  console.log(`LEIDER ecommerce API running on http://localhost:${config.port}`);
});
