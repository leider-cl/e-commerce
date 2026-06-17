import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, authConfig.jwtSecret);
    req.user = { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
