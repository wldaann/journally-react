
const express = require("express");
const db = require("./db");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

// Semua endpoint Todo wajib memiliki token valid.
router.use(authMiddleware);

// GET: mengambil semua Todo milik user yang login
router.get("/", async (req, res) => {
  try {
    const [todos] = await db.query(
      `SELECT id, title, completed, priority, deadline, created_at
       FROM todos
       WHERE user_id = ?
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil Todo." });
  }
});

// POST: menambahkan Todo
router.post("/", async (req, res) => {
  try {
    const { title, priority = "medium", deadline = null } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Judul Todo wajib diisi.",
      });
    }

    if (!["high", "medium", "low"].includes(priority)) {
      return res.status(400).json({
        message: "Prioritas tidak valid.",
      });
    }

    if (
      deadline !== null &&
      (typeof deadline !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
        !Number.isFinite(Date.parse(`${deadline}T00:00:00Z`)) ||
        new Date(`${deadline}T00:00:00Z`).toISOString().slice(0, 10) !== deadline)
    ) {
      return res.status(400).json({
        message: "Format deadline harus YYYY-MM-DD.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO todos (user_id, title, priority, deadline)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, title.trim(), priority, deadline]
    );

    const [rows] = await db.query(
      `SELECT id, title, completed, priority, deadline, created_at
       FROM todos
       WHERE id = ? AND user_id = ?`,
      [result.insertId, req.user.id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan Todo." });
  }
});

// PATCH: mengubah Todo
router.patch("/:id", async (req, res) => {
  try {
    const { title, completed, priority, deadline } = req.body;
    const updates = [];
    const values = [];

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Judul Todo tidak valid." });
      }

      updates.push("title = ?");
      values.push(title.trim());
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ message: "Status Todo tidak valid." });
      }

      updates.push("completed = ?");
      values.push(completed);
    }

    if (priority !== undefined) {
      if (!["high", "medium", "low"].includes(priority)) {
        return res.status(400).json({ message: "Prioritas tidak valid." });
      }

      updates.push("priority = ?");
      values.push(priority);
    }

    if (deadline !== undefined) {
      if (
        deadline !== null &&
        (typeof deadline !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
          !Number.isFinite(Date.parse(`${deadline}T00:00:00Z`)) ||
          new Date(`${deadline}T00:00:00Z`).toISOString().slice(0, 10) !== deadline)
      ) {
        return res.status(400).json({
          message: "Format deadline harus YYYY-MM-DD.",
        });
      }

      updates.push("deadline = ?");
      values.push(deadline);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "Tidak ada perubahan." });
    }

    values.push(req.params.id, req.user.id);

    const [result] = await db.query(
      `UPDATE todos SET ${updates.join(", ")}
       WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Todo tidak ditemukan.",
      });
    }

    const [rows] = await db.query(
      `SELECT id, title, completed, priority, deadline, created_at
       FROM todos
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengubah Todo." });
  }
});

// DELETE: menghapus Todo milik user yang login
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Todo tidak ditemukan.",
      });
    }

    res.json({ message: "Todo berhasil dihapus." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus Todo." });
  }
});

module.exports = router;
