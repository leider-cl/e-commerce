import { randomBytes } from "crypto";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { authConfig } from "../config/auth.js";
import { authenticate } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Este email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await pool.query(
      `INSERT INTO users (name, email, password_hash, email_verified, verification_token, verification_token_expires_at)
       VALUES ($1, $2, $3, FALSE, $4, $5)`,
      [name, email, passwordHash, verificationToken, tokenExpires]
    );

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}`;

    console.log(`\n[EMAIL VERIFICATION] ${email}`);
    console.log(`[VERIFY URL] ${verifyUrl}\n`);

    res.status(201).json({
      message: "Registro exitoso. Revisá tu correo para verificar tu cuenta.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

authRouter.get("/auth/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token de verificación requerido" });
    }

    const result = await pool.query(
      `SELECT id, email, email_verified, verification_token_expires_at
       FROM users WHERE verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido o ya fue usado" });
    }

    const user = result.rows[0];

    if (user.email_verified) {
      return res.json({ message: "El email ya estaba verificado. Podés iniciar sesión." });
    }

    if (new Date() > new Date(user.verification_token_expires_at)) {
      return res.status(400).json({ error: "El token de verificación expiró. Solicitá uno nuevo." });
    }

    await pool.query(
      `UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires_at = NULL
       WHERE id = $1`,
      [user.id]
    );

    res.json({ message: "Email verificado exitosamente. Ya podés iniciar sesión." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Error al verificar email" });
  }
});

authRouter.post("/auth/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const result = await pool.query(
      "SELECT id, email_verified FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No hay una cuenta con ese email" });
    }

    const user = result.rows[0];

    if (user.email_verified) {
      return res.json({ message: "El email ya está verificado. Podés iniciar sesión." });
    }

    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE users SET verification_token = $1, verification_token_expires_at = $2
       WHERE id = $3`,
      [verificationToken, tokenExpires, user.id]
    );

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}`;

    console.log(`\n[EMAIL VERIFICATION (resent)] ${email}`);
    console.log(`[VERIFY URL] ${verifyUrl}\n`);

    res.json({ message: "Si el email existe, recibirás un nuevo link de verificación." });
  } catch (error) {
    console.error("Error resending verification:", error);
    res.status(500).json({ error: "Error al reenviar verificación" });
  }
});

authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash, role, email_verified FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Email no verificado. Revisá tu correo o solicitá un nuevo link de verificación.",
        needsVerification: true,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

authRouter.get("/auth/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, email_verified, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});
