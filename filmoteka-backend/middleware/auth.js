const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../firebase-key.json")),
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Brak tokenu autoryzacyjnego." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      userId: decodedToken.uid,
      username: decodedToken.name || "Użytkownik",
      email: decodedToken.email,
    };

    next();
  } catch (err) {
    console.error("❌ Błąd weryfikacji tokenu:", err.message);
    return res.status(401).json({ error: "Nieautoryzowany. Token niepoprawny." });
  }
};


