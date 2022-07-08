const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = async (req, res, next) => {
  let sauceObject = await JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  await sauce
    .save()
    .catch((error) => {
      res.status(400).json({ error });
      throw new Error("creating sauce arborded");
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
