const mongoose = require("mongoose");
require("dotenv").config();

console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Działa!"))
  .catch(err => console.error("❌ Błąd:", err));
