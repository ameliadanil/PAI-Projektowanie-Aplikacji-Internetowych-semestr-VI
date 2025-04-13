const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// 📦 Import tras
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// 🚀 Użycie tras
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

// Testowa trasa główna
app.get("/", (req, res) => {
  res.send("🎬 Filmoteka API działa!");
});

// 🔌 Połączenie z MongoDB i start serwera
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Połączono z bazą danych MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serwer działa na porcie ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));


