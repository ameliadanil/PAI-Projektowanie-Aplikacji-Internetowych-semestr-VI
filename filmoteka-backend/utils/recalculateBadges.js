const Review = require("../models/Review");

module.exports = async function recalculateBadges(user) {
  const updatedBadges = new Set(user.badges || []);
  const reviewCount = await Review.countDocuments({ user: user._id });
  const favoritesCount = user.favorites.length;
  const watchlistCount = user.watchlist.length;

  if (reviewCount >= 1) updatedBadges.add("Pierwsza recenzja");
  if (reviewCount >= 5) updatedBadges.add("Recenzent");
  if (favoritesCount + watchlistCount >= 1) updatedBadges.add("Filmowy debiutant");
  if (favoritesCount + watchlistCount >= 10) updatedBadges.add("10 filmów");
  if (user.isPremium && reviewCount + favoritesCount >= 10) updatedBadges.add("Premium Master");

  user.badges = Array.from(updatedBadges);
  await user.save();
};
