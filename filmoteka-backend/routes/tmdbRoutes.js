const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// GET /api/tmdb/search?query=tytul
router.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Brak zapytania do wyszukania" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: "pl-PL"
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Błąd podczas pobierania danych z TMDb:", err.message);
    res.status(500).json({ error: "Nie udało się pobrać danych z TMDb" });
  }
});

module.exports = router;
