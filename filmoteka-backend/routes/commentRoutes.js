const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// POST /api/comments – dodanie komentarza (zalogowany użytkownik)
router.post("/", auth, async (req, res) => {
  const { movie, text } = req.body;
  try {
    const comment = new Comment({ movie, user: req.user.userId, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu komentarza:", err);
    res.status(500).json({ error: "Nie udało się dodać komentarza" });
  }
});

// GET /api/comments/:movieId – komentarze danego filmu (publicznie dostępne)
router.get("/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({ movie: req.params.movieId })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu komentarzy:", err);
    res.status(500).json({ error: "Nie udało się pobrać komentarzy" });
  }
});

module.exports = router;
