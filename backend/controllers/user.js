const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const User = require("../models/User");

exports.signup = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10); // attente de la réponse du hashage du mdp
  const user = new User({
    email: req.body.email,
    password: hash,
  }); // creation de l'utilisateur en attribuant le mdp hash a la place de l'initial
  await user
    .save() // attente de la réponse de la sauvegarde de celui ci
    .catch((error) => {
      res.status(400).json({ error });
      throw new Error("This user already exists");
    }) // catch l'erreur et renvoie un code 400 plus un message specifiant le problème
    .then(() => res.status(201).json({ message: "User created !" })); // sinon renvoie d'un code 201 et d'un message pour specifier la creation de l'utilisateur
};

exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: "User not find !" });
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).json({ error: "Wrong password !" });

  res.status(200).json({
    userId: user._id,
    token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    }),
  });
};
