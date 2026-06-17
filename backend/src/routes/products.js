import { Router } from "express";
import { pool } from "../config/db.js";

export const productsRouter = Router();

productsRouter.get("/products", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, slug, category, price, stock, description, tag FROM products ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

productsRouter.get("/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, slug, category, price, stock, description, tag FROM products WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

productsRouter.get("/categories", async (_req, res) => {
  try {
    const result = await pool.query("SELECT name FROM categories ORDER BY name");
    res.json(result.rows.map(r => r.name));
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});