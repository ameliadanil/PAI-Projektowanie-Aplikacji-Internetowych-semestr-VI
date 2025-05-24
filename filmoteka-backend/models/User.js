const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  isPremium: {
    type: Boolean,
    default: false // ✅ Domyślnie niepremium
  },
  badges: {
    type: [String], // 🏅 Odznaki użytkownika
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);




