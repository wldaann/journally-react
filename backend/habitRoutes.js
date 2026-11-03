
const express = require("express");
const db = require("./db");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Mengambil semua habit milik akun yang login,
// termasuk tanggal checklist-nya.
router.get("/", async (req, res) => {
  try {
    const [habits] = await db.query(
  `SELECT
     h.id,
     h.name,
     h.icon,
     h.created_at,
     DATE_FORMAT(hc.completed_date, '%Y-%m-%d') AS completed_date
   FROM habits h
   LEFT JOIN habit_completions hc
     ON hc.habit_id = h.id
     AND hc.user_id = h.user_id
   WHERE h.user_id = ?
   ORDER BY h.id DESC, hc.completed_date ASC`,
  [req.user.id]
);

    const habitMap = new Map();

    for (const row of habits) {
      if (!habitMap.has(row.id)) {
        habitMap.set(row.id, {
          id: row.id,
          name: row.name,
          icon: row.icon,
          completedDates: [],
        });
      }

      if (row.completed_date) {
  const date = String(row.completed_date).slice(0, 10);

  habitMap.get(row.id).completedDates.push(date);
}
    }

    res.json(Array.from(habitMap.values()));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil habit.",
    });
  }
});

// Menambahkan habit
router.post("/", async (req, res) => {
  try {
    const { name, icon = "💻" } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Nama habit wajib diisi.",
      });
    }

    if (typeof icon !== "string" || icon.length > 20) {
      return res.status(400).json({
        message: "Ikon habit tidak valid.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO habits (user_id, name, icon)
       VALUES (?, ?, ?)`,
      [req.user.id, name.trim(), icon]
    );

    res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      icon,
      completedDates: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menambahkan habit.",
    });
  }
});

// Mengubah nama atau ikon habit
router.patch("/:id", async (req, res) => {
  try {
    const { name, icon } = req.body;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Nama habit tidak valid.",
        });
      }

      updates.push("name = ?");
      values.push(name.trim());
    }

    if (icon !== undefined) {
      if (typeof icon !== "string" || icon.length > 20) {
        return res.status(400).json({
          message: "Ikon habit tidak valid.",
        });
      }

      updates.push("icon = ?");
      values.push(icon);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        message: "Tidak ada perubahan.",
      });
    }

    values.push(req.params.id, req.user.id);

    const [result] = await db.query(
      `UPDATE habits
       SET ${updates.join(", ")}
       WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Habit tidak ditemukan.",
      });
    }

    const [rows] = await db.query(
      `SELECT id, name, icon
       FROM habits
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengubah habit.",
    });
  }
});

// Checklist atau batalkan checklist tanggal tertentu
router.put("/:id/completions/:date", async (req, res) => {
  try {
    const { id, date } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Status checklist tidak valid.",
      });
    }

    const validDate =
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      Number.isFinite(Date.parse(`${date}T00:00:00Z`)) &&
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;

    if (!validDate) {
      return res.status(400).json({
        message: "Format tanggal harus YYYY-MM-DD.",
      });
    }

    const [ownedHabit] = await db.query(
      "SELECT id FROM habits WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (ownedHabit.length === 0) {
      return res.status(404).json({
        message: "Habit tidak ditemukan.",
      });
    }

    if (completed) {
      await db.query(
        `INSERT IGNORE INTO habit_completions
         (habit_id, user_id, completed_date)
         VALUES (?, ?, ?)`,
        [id, req.user.id, date]
      );
    } else {
      await db.query(
        `DELETE FROM habit_completions
         WHERE habit_id = ?
           AND user_id = ?
           AND completed_date = ?`,
        [id, req.user.id, date]
      );
    }

    res.json({
      message: "Checklist berhasil diperbarui.",
      habitId: Number(id),
      date,
      completed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui checklist.",
    });
  }
});

// Menghapus habit beserta riwayat checklist-nya
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM habits WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Habit tidak ditemukan.",
      });
    }

    res.json({
      message: "Habit berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menghapus habit.",
    });
  }
});

module.exports = router;
