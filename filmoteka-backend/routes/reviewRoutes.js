const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const User = require("../models/User");
const recalculateBadges = require("../utils/recalculateBadges");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// ✅ Dodawanie recenzji do filmu
router.post("/movie/:tmdbId", auth, async (req, res) => {
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

    const user = await User.findOne({ uid: req.user.uid || req.user.userId });
    if (!user) return res.status(404).json({ error: "Użytkownik nie został znaleziony." });

    const review = new Review({
      movie: movie._id,
      user: user.uid,
      username: user.username,
      rating,
      comment,
    });

    await review.save();
    await recalculateBadges(user);

    res.status(201).json({ message: "📝 Recenzja dodana!", review });
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu recenzji:", err.message);
    res.status(500).json({ error: "Błąd serwera przy dodawaniu recenzji." });
  }
});

// ✅ Pobieranie recenzji
router.get("/movie/:tmdbId", async (req, res) => {
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

module.exports = router;




















