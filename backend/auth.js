const { rateLimit } = require("express-rate-limit");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();

// Membatasi percobaan login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
  },
});

// Membatasi percobaan register
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Terlalu banyak percobaan registrasi. Coba lagi dalam 15 menit.",
  },
});

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================
// REGISTER
// =========================

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Format data tidak valid.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        message: "Nama harus 1-100 karakter.",
      });
    }

    if (
      !validEmail(cleanEmail) ||
      cleanEmail.length > 150
    ) {
      return res.status(400).json({
        message: "Format email tidak valid.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password harus 8-72 karakter.",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Email sudah terdaftar.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [cleanName, cleanEmail, hashedPassword]
    );

    res.status(201).json({
      message: "Registrasi berhasil.",
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email sudah terdaftar.",
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
});

// =========================
// LOGIN
// =========================

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email dan password wajib diisi.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!validEmail(cleanEmail) || cleanEmail.length > 150) {
      return res.status(400).json({
        message: "Email atau password salah.",
      });
    }

    if (password.length > 72) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const [users] = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
});

module.exports = router;
