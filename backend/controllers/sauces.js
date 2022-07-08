const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = async (req, res, next) => {
  let sauceObject = await JSON.parse(req.body.sauce); // decoupe la requete en plusieurs champs
  delete sauceObject._id; // enleve l'id pour la remplacer plus tard
  delete sauceObject._userId; // enleve l'userId pour l'attribuer plus tard
  const sauce = new Sauce({
    ...sauceObject, // creation d'un objet sauce en attribuant les champs de la requete + l'userId (l'utilisateur qui cree la sauce) et la creation de l'URL de l'image
    userId: req.auth.userId, // creation des compteurs likes et dislikes, ainsi que des tableau rassemblant la liste des utilisateurs
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  await sauce // on attends la creation de l'objet, pour le sauvegarder, et si probleme apparait, le catch pour envoyer un message d'erreur sinon renvoyer un msg objet cree
    .save()
    .catch((error) => {
      res.status(400).json({ error });
    })
    .then(() => res.status(201).json({ message: "Objet enregistré !" }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = async (req, res, next) => {
  const sauceObject = (await req.file)
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  let sauce = await Sauce.findOne({ _id: req.params.id });
  if (!sauce) return res.status(400).json({ error: "Sauce not find" });
  if (sauce.userId != req.auth.userId) {
    res.status(401).json({ message: "Not authorized" });
  } else {
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modified !" }))
      .catch((error) => res.status(401).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find().then((sauces) => {
      res.status(200).json(sauces);
    });
  } catch (error) {
    res.status(400).json({ error });
    throw new Error("no sauces find ! ");
  }
};
