const jwt = require("../managers/jwt");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //enlève le Bearer
    const decodedToken = jwt.verify(token); // vérifie le token transmis avec le token placé dans .env.local
    const userId = decodedToken.userId; // récupère l'userId de ce token (voir jwt.io)
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
