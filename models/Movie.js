const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  poster: String,
  overview: String,
  releaseDate: String,
});

module.exports = mongoose.model("Movie", movieSchema);
