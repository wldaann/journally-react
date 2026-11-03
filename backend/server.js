const journalRoutes = require("./journalRoutes");
const habitRoutes = require("./habitRoutes");
const todoRoutes = require("./todoRoutes");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./auth");

const app = express();
const PORT = 5000;

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "20mb" }));

app.use("/api/journals", journalRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Personal Life System berhasil berjalan 🚀",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.get("/test-db", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT 1 AS result");

      res.json({
        message: "Database MySQL berhasil terhubung 🎉",
        data: rows,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal terhubung ke database",
      });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});