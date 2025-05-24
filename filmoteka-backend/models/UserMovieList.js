// models/UserMovieList.js

const mongoose = require("mongoose");

const userMovieListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userMovieListSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model("UserMovieList", userMovieListSchema);
