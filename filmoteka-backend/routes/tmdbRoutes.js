const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// 🔍 Wyszukiwanie filmów: /api/tmdb/search?query=Matrix
router.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Brak zapytania do wyszukania" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: "pl-PL"
      }
    });

    res.json(response.data.results); // tylko tablica wyników
  } catch (err) {
    console.error("❌ Błąd podczas pobierania danych z TMDb:", err.message);
    res.status(500).json({ error: "Nie udało się pobrać danych z TMDb" });
  }
});

// 📄 Szczegóły filmu: /api/tmdb/movie/:id
router.get("/movie/:id", async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "pl-PL"
      }
    });

    const data = response.data;

    res.json({
      tmdbId: data.id,               // 👈 Dodane pole tmdbId
      title: data.title,
      poster_path: data.poster_path,
      overview: data.overview,
      release_date: data.release_date,
      vote_average: data.vote_average
    });
  } catch (err) {
    console.error("❌ Błąd podczas pobierania szczegółów filmu:", err.message);
    res.status(500).json({ error: "Nie udało się pobrać szczegółów filmu" });
  }
});

module.exports = router;

