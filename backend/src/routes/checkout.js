import { randomBytes } from "crypto";
import { Router } from "express";
import { pool } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

export const checkoutRouter = Router();

checkoutRouter.post("/checkout", authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items?.length) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total, status, items)
       VALUES ($1, $2, 'pending', $3)
       RETURNING id`,
      [req.user.id, total, JSON.stringify(items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })))]
    );

    const orderId = orderResult.rows[0].id;

    console.log(`[ORDER #${orderId}] Created for user ${req.user.id}, total $${total}`);
    console.log(`[ORDER #${orderId}] Items:`, items.map(i => `${i.name} x${i.quantity}`).join(", "));

    const token_ws = `stub_${randomBytes(16).toString("hex")}`;
    const stubUrl = `${req.protocol}://${req.get("host")}/api/checkout/return?token_ws=${token_ws}`;

    console.log(`[CHECKOUT] Stub URL: ${stubUrl}`);

    res.json({ url: stubUrl });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Error al iniciar el proceso de pago" });
  }
});

checkoutRouter.get("/checkout/return", async (req, res) => {
  try {
    const { token_ws } = req.query;

    if (!token_ws) {
      return res.status(400).json({ error: "token_ws requerido" });
    }

    console.log(`[CHECKOUT RETURN] token_ws: ${token_ws}`);

    const orderResult = await pool.query(
      "SELECT id FROM orders ORDER BY id DESC LIMIT 1"
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const orderId = orderResult.rows[0].id;

    await pool.query(
      "UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = $1",
      [orderId]
    );

    console.log(`[ORDER #${orderId}] Marked as paid`);

    res.json({ status: "paid", order_id: orderId });
  } catch (error) {
    console.error("Error processing checkout return:", error);
    res.status(500).json({ error: "Error al confirmar el pago" });
  }
});
