
const express = require("express");
const db = require("./db");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Mengambil semua jurnal milik akun yang login
router.get("/", async (req, res) => {
  try {
    const [journals] = await db.query(
      `SELECT
        id,
        title,
        content,
        mood,
        tag,
        image,
        favorite,
        DATE_FORMAT(journal_date, '%Y-%m-%d') AS journalDate,
        DATE_FORMAT(journal_date, '%d/%m/%Y') AS date
       FROM journals
       WHERE user_id = ?
       ORDER BY journal_date DESC, id DESC`,
      [req.user.id]
    );

    res.json(
      journals.map((journal) => ({
        ...journal,
        favorite: Boolean(journal.favorite),
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil jurnal.",
    });
  }
});

// Mengambil satu jurnal berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const [journals] = await db.query(
      `SELECT
        id,
        title,
        content,
        mood,
        tag,
        image,
        favorite,
        DATE_FORMAT(journal_date, '%Y-%m-%d') AS journalDate,
        DATE_FORMAT(journal_date, '%d/%m/%Y') AS date
       FROM journals
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (journals.length === 0) {
      return res.status(404).json({
        message: "Jurnal tidak ditemukan.",
      });
    }

    res.json({
      ...journals[0],
      favorite: Boolean(journals[0].favorite),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil detail jurnal.",
    });
  }
});

// Menambahkan jurnal
router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      tag,
      image = "",
      date,
    } = req.body;

    if (
      !title?.trim() ||
      !content?.trim() ||
      !mood ||
      !tag
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi.",
      });
    }

    if (typeof image !== "string") {
      return res.status(400).json({
        message: "Format foto tidak valid.",
      });
    }

    if (image.length > 15_000_000) {
      return res.status(413).json({
        message: "Ukuran foto terlalu besar.",
      });
    }

    const journalDate = date || new Date().toISOString().slice(0, 10);

    const [result] = await db.query(
      `INSERT INTO journals
       (user_id, title, content, mood, tag, image, favorite, journal_date)
       VALUES (?, ?, ?, ?, ?, ?, FALSE, ?)`,
      [
        req.user.id,
        title.trim(),
        content,
        mood,
        tag,
        image,
        journalDate,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      title: title.trim(),
      content,
      mood,
      tag,
      image,
      favorite: false,
      journalDate,
      date: journalDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menyimpan jurnal.",
    });
  }
});

// Mengubah jurnal
router.patch("/:id", async (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      tag,
      image,
    } = req.body;

    if (
      !title?.trim() ||
      !content?.trim() ||
      !mood ||
      !tag
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi.",
      });
    }

    if (
      image !== undefined &&
      typeof image !== "string"
    ) {
      return res.status(400).json({
        message: "Format foto tidak valid.",
      });
    }

    if (image && image.length > 15_000_000) {
      return res.status(413).json({
        message: "Ukuran foto terlalu besar.",
      });
    }

    const [result] = await db.query(
      `UPDATE journals
       SET title = ?,
           content = ?,
           mood = ?,
           tag = ?,
           image = ?
       WHERE id = ? AND user_id = ?`,
      [
        title.trim(),
        content,
        mood,
        tag,
        image ?? "",
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      const [existing] = await db.query(
        "SELECT id FROM journals WHERE id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          message: "Jurnal tidak ditemukan.",
        });
      }
    }

    const [journals] = await db.query(
      `SELECT
        id, title, content, mood, tag, image, favorite,
        DATE_FORMAT(journal_date, '%Y-%m-%d') AS journalDate,
        DATE_FORMAT(journal_date, '%d/%m/%Y') AS date
       FROM journals
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({
      ...journals[0],
      favorite: Boolean(journals[0].favorite),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui jurnal.",
    });
  }
});

// Mengubah status favorite
router.patch("/:id/favorite", async (req, res) => {
  try {
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        message: "Status favorite tidak valid.",
      });
    }

    const [result] = await db.query(
      `UPDATE journals
       SET favorite = ?
       WHERE id = ? AND user_id = ?`,
      [favorite, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      const [existing] = await db.query(
        "SELECT id FROM journals WHERE id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          message: "Jurnal tidak ditemukan.",
        });
      }
    }

    res.json({
      message: "Favorite berhasil diperbarui.",
      id: Number(req.params.id),
      favorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui favorite.",
    });
  }
});

// Menghapus jurnal
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM journals WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Jurnal tidak ditemukan.",
      });
    }

    res.json({
      message: "Jurnal berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menghapus jurnal.",
    });
  }
});

module.exports = router;
