const bcrypt = require("bcrypt");
const jwt = require("../managers/jwt");
const User = require("../models/User");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!emailRegex.test(email))
    return res.status(401).json({ error: "Invalid email !" });
  if (password.length > 128)
    return res.status(401).json({ error: "Password to long !" });
  const hash = await bcrypt.hash(req.body.password, 10); // attente de la réponse du hashage du mdp
  const user = new User({ email, password: hash }); // creation de l'utilisateur en attribuant le mdp hash a la place de l'initial
  await user
    .save() // attente de la réponse de la sauvegarde de celui ci
    .catch((error) => {
      throw res.status(400).json({ error });
    }); // catch l'erreur et renvoie un code 400 plus un message specifiant le problème

  res.status(201).json({ message: "User created !" }); // sinon renvoie d'un code 201 et d'un message pour specifier la creation de l'utilisateur
};

exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials !" });
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials !" });

  res.status(200).json({
    userId: user._id,
    token: jwt.sign({ userId: user._id }), //config de jwt dans jwt.js
  });
};
