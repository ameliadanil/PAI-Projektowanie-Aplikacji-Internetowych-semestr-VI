const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// POST /api/auth/register – rejestracja
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Użytkownik zarejestrowany" });
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera podczas rejestracji" });
  }
});

// POST /api/auth/login – logowanie
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Nieprawidłowe dane logowania" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Nieprawidłowe hasło" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username, // ✅ Dodano username do payloadu JWT
        isPremium: user.isPremium || false
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera podczas logowania" });
  }
});

// GET /api/auth/me – dane aktualnie zalogowanego użytkownika
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie został znaleziony" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu danych użytkownika:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;




