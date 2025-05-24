const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Movie = require("../models/Movie");
const UserMovieList = require("../models/UserMovieList");
const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// 🔄 Dodaj lub zaktualizuj tagi / notatkę do filmu
router.post("/:tmdbId", auth, async (req, res) => {
  const { tmdbId } = req.params;
  const { tags, note } = req.body;

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

    const entry = await UserMovieList.findOneAndUpdate(
      { user: req.user.userId, movie: movie._id },
      { $set: { tags: tags || [], note: note || "" } },
      { upsert: true, new: true }
    );

    res.json({ message: "📌 Dane zapisane!", entry });
  } catch (err) {
    console.error("❌ Błąd zapisu tagów/notatki:", err.message);
    res.status(500).json({ error: "Błąd zapisu danych" });
  }
});

// ✅ Pobierz wszystkie filmy użytkownika z tagami
router.get("/", auth, async (req, res) => {
  try {
    const entries = await UserMovieList.find({ user: req.user.userId }).populate("movie");
    res.json(entries);
  } catch (err) {
    console.error("❌ Błąd pobierania tagów:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 🔎 Filtrowanie po tagu: /api/usermovielist?tag=horror
router.get("/filter", auth, async (req, res) => {
  const { tag } = req.query;

  try {
    const entries = await UserMovieList.find({
      user: req.user.userId,
      tags: tag,
    }).populate("movie");

    res.json(entries);
  } catch (err) {
    console.error("❌ Błąd filtrowania po tagu:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;
