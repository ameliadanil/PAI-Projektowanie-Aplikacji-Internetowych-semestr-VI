const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST /api/reviews – dodanie recenzji
router.post("/", async (req, res) => {
  console.log("✅ Dotarło do trasy POST /api/reviews");
  const { movie, username, rating, comment } = req.body;

  try {
    const review = new Review({ movie, username, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu recenzji:", err);
    res.status(500).json({ error: "Nie udało się dodać recenzji" });
  }
});

// GET /api/reviews/:movieId – pobieranie recenzji filmu
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu recenzji:", err);
    res.status(500).json({ error: "Nie udało się pobrać recenzji" });
  }
});

// DELETE /api/reviews/:id – usuwanie recenzji
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Recenzja nie została znaleziona" });
    }
    res.json({ message: "✅ Recenzja została usunięta" });
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu recenzji:", err);
    res.status(500).json({ error: "Nie udało się usunąć recenzji" });
  }
});

// PUT /api/reviews/:id – edycja recenzji
router.put("/:id", async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Recenzja nie została znaleziona" });
    }

    res.json(updatedReview);
  } catch (err) {
    console.error("❌ Błąd przy edycji recenzji:", err);
    res.status(500).json({ error: "Nie udało się zaktualizować recenzji" });
  }
});

module.exports = router;







