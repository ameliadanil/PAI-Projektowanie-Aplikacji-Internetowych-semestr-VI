const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const premiumOnly = require("../middleware/premium");
const User = require("../models/User");
const Movie = require("../models/Movie");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");
const { Readable } = require("stream");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// 📋 Pobierz ulubione filmy (z sortowaniem)
router.get("/favorites", auth, async (req, res) => {
  try {
    const sortField = req.query.sort === "title" ? "title" : "_id";
    const user = await User.findById(req.user.userId).populate({
      path: "favorites",
      options: { sort: { [sortField]: 1 } },
    });

    res.json(user.favorites);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu ulubionych:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 📋 Pobierz watchlistę (z sortowaniem)
router.get("/watchlist", auth, async (req, res) => {
  try {
    const sortField = req.query.sort === "title" ? "title" : "_id";
    const user = await User.findById(req.user.userId).populate({
      path: "watchlist",
      options: { sort: { [sortField]: 1 } },
    });

    res.json(user.watchlist);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu watchlisty:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 🔄 Dodaj film do ulubionych
router.post("/favorites/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
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

    if (!user.favorites.includes(movie._id)) {
      user.favorites.push(movie._id);
      await user.save();
    }

    res.json({ message: "✅ Film dodany do ulubionych", movie });
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu filmu do ulubionych:", err.message);
    res.status(500).json({ error: "Nie udało się dodać filmu do ulubionych" });
  }
});

// ❌ Usuń film z ulubionych
router.delete("/favorites/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    const movie = await Movie.findOne({ tmdbId });

    if (!movie) return res.status(404).json({ error: "Film nie został znaleziony" });

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== movie._id.toString()
    );

    await user.save();
    res.json({ message: "🗑️ Film usunięty z ulubionych" });
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu filmu z ulubionych:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 🎬 Dodaj film do watchlisty
router.post("/watchlist/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
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

    if (!user.watchlist.includes(movie._id)) {
      user.watchlist.push(movie._id);
      await user.save();
    }

    res.json({ message: "📥 Film dodany do listy Do obejrzenia", movie });
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu do watchlisty:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// ❌ Usuń film z watchlisty
router.delete("/watchlist/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    const movie = await Movie.findOne({ tmdbId });

    if (!movie) return res.status(404).json({ error: "Film nie został znaleziony" });

    user.watchlist = user.watchlist.filter(
      (id) => id.toString() !== movie._id.toString()
    );

    await user.save();
    res.json({ message: "🗑️ Film usunięty z watchlisty" });
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu z watchlisty:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;














