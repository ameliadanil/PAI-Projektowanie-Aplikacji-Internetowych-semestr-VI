const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Brak tokenu autoryzacyjnego" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dodano username
    req.user = {
      userId: decoded.userId,
      username: decoded.username, // 👈 DODANE
      isPremium: decoded.isPremium || false,
    };

    next();
  } catch (err) {
    console.error("❌ Błąd weryfikacji tokenu:", err.message);
    res.status(401).json({ error: "Nieprawidłowy token" });
  }
};
