const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// POST /api/movies – dodanie nowego filmu do bazy
router.post("/", async (req, res) => {
  const { tmdbId, title, poster, overview, releaseDate } = req.body;

  try {
    const movie = new Movie({ tmdbId, title, poster, overview, releaseDate });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error("❌ Błąd przy dodawaniu filmu:", err);
    res.status(500).json({ error: "Nie udało się dodać filmu" });
  }
});

// GET /api/movies – pobranie wszystkich zapisanych filmów
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu filmów:", err);
    res.status(500).json({ error: "Nie udało się pobrać filmów" });
  }
});

module.exports = router;
