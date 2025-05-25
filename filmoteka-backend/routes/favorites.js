
const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

router.post('/add', async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    const newFavorite = new Favorite({ userId, movieId });
    await newFavorite.save();
    res.status(200).json({ message: 'Dodano do ulubionych' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.delete('/remove', async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    await Favorite.findOneAndDelete({ userId, movieId });
    res.status(200).json({ message: 'Usunięto z ulubionych' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
