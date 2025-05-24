const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const User = require("../models/User");
const recalculateBadges = require("../utils/recalculateBadges");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// ✅ Dodaj recenzję z oceną
router.post("/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ error: "Komentarz i ocena są wymagane." });
  }

  try {
    let movie = await Movie.findOne({ tmdbId });

    if (!movie) {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
        params: { api_key: TMDB_API_KEY, language: "pl-PL" },
      });

      const { title, poster_path, overview, release_date } = response.data;

      movie = new Movie({
        tmdbId,
        title,
        poster: poster_path,
        overview,
        releaseDate: release_date,
      });

      await movie.save();
    }

    const review = new Review({
      movie: movie._id,
      user: req.user.userId,
      username: req.user.username,
      rating,
      comment,
    });

    await review.save();

    const user = await User.findById(req.user.userId);
    await recalculateBadges(user); // 🎖️ Oblicz odznaki

    res.status(201).json({ message: "📝 Recenzja dodana!", review });
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu recenzji:", err.message);
    res.status(500).json({ error: "Błąd serwera przy dodawaniu recenzji." });
  }
});

// ✅ Pobierz wszystkie recenzje danego filmu
router.get("/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.status(404).json({ error: "Film nie został znaleziony." });

    const reviews = await Review.find({ movie: movie._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu recenzji:", err.message);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu recenzji." });
  }
});

// ✅ Pobierz średnią ocenę danego filmu
router.get("/average/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.status(404).json({ error: "Film nie został znaleziony." });

    const reviews = await Review.find({ movie: movie._id });

    if (reviews.length === 0) {
      return res.json({ averageRating: null, total: 0 });
    }

    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avg = (sum / reviews.length).toFixed(1);

    res.json({ averageRating: avg, total: reviews.length });
  } catch (err) {
    console.error("❌ Błąd przy liczeniu średniej oceny:", err.message);
    res.status(500).json({ error: "Błąd serwera przy liczeniu oceny." });
  }
});

// ✅ Edytuj recenzję użytkownika
router.put("/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ error: "Komentarz i ocena są wymagane." });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Recenzja nie została znaleziona." });

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Brak uprawnień do edycji tej recenzji." });
    }

    review.comment = comment;
    review.rating = rating;
    await review.save();

    res.json({ message: "✏️ Recenzja zaktualizowana", review });
  } catch (err) {
    console.error("❌ Błąd przy edytowaniu recenzji:", err.message);
    res.status(500).json({ error: "Błąd serwera przy edycji recenzji." });
  }
});

// ✅ Usuń recenzję użytkownika
router.delete("/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Recenzja nie została znaleziona." });

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Brak uprawnień do usunięcia tej recenzji." });
    }

    await Review.deleteOne({ _id: reviewId });
    res.json({ message: "🗑 Recenzja została usunięta." });
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu recenzji:", err.message);
    res.status(500).json({ error: "Błąd serwera przy usuwaniu recenzji." });
  }
});

module.exports = router;















