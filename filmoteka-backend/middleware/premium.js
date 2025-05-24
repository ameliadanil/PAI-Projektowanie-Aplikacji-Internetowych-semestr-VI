// middleware/premium.js
module.exports = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ error: "Ten zasób jest dostępny tylko dla użytkowników premium." });
  }
  next();
};
