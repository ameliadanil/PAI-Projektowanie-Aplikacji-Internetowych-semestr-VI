const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 📦 Import tras
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tmdbRoutes = require("./routes/tmdbRoutes");
const userRoutes = require("./routes/userRoutes");
const userActionsRoutes = require("./routes/userActions");
const userMovieListRoutes = require("./routes/userMovieListRoutes");

// 🚀 Użycie tras
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", userActionsRoutes);
app.use("/api/usermovielist", userMovieListRoutes);

// 🧪 Trasa testowa
app.get("/", (req, res) => {
  res.send("🎬 Filmoteka API działa!");
});

// 🔌 Połączenie z MongoDB i uruchomienie serwera
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Połączono z bazą danych MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serwer działa na porcie ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Błąd połączenia z MongoDB:", err.message);
  });











