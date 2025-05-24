const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/user/mylists — tylko dla zalogowanego użytkownika
router.get("/mylists", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "Użytkownik nie znaleziony" });

    res.json({
      favorites: user.favorites || [],
      watchlist: user.watchlist || [],
    });
  } catch (err) {
    console.error("❌ Błąd pobierania danych użytkownika:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// POST /api/user/setPremium/:userId — nadaj premium (np. do testów/admina)
router.post("/setPremium/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "Użytkownik nie znaleziony" });

    user.isPremium = true;
    await user.save();

    res.json({ message: "✅ Użytkownik ma teraz premium." });
  } catch (err) {
    console.error("❌ Błąd ustawiania premium:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;

