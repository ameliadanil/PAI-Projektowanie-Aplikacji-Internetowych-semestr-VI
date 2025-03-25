const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// 💡 Dodaj te dwie linijki tutaj:
const movieRoutes = require("./routes/movieRoutes");
app.use("/api/movies", movieRoutes);

// Testowa trasa
app.get("/", (req, res) => {
  res.send("🎬 Filmoteka API działa!");
});

// Połączenie z MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Połączono z bazą danych MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serwer działa na porcie ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));

