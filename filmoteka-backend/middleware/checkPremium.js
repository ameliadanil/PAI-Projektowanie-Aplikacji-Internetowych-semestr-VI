module.exports = (req, res, next) => {
  if (!req.user?.isPremium) {
    return res.status(403).json({ error: "Dostęp tylko dla użytkowników premium." });
  }
  next();
};
