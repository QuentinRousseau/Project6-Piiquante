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

exports.getOneSauce = async (req, res, next) => {
  await Sauce.findOne({ _id: req.params.id })
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

exports.deleteSauce = async (req, res, next) => {
  await Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("images/")[1];
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

exports.likeOrDislike = async (req, res, next) => {
  // getsauceId => const mySauce
  // hasLike => mySauce.userliked.includes(userId)
  // hasDislike => mySauce.userdisLiked.includes(userId)
  // if(hasLike) => enlever l'user de la liste et enlever 1 au compteur de like
  // if(hasDislike) => enlever l'user de la liste et enlever 1 au compteur de dislike
  //  if(like === 1) => ajouter l'user a la liste et ajouter 1 au au compteur de like
  //  if(like === -1) => ajouter l'user a la liste et ajouter 1 au compteur de dislike
  // sauvegarde sur mongoDB => mySauce.save()
  // res.status(200).json(message:" updated !");

  const like = req.body.like; // 1 || 0 || -1
  const userId = req.body.userId; // recupere l'userid qui interagis
  const sauceId = req.params.id; // id de la sauce recupéré dans l'url de la requete
  const mySauce = await Sauce.findById(sauceId); // recherche la sauce concernée par la req
  const hasLike = mySauce.usersLiked.includes(userId); // vérifie que l'utilisateur est présent dans la liste "likes"
  const hasDislike = mySauce.usersDisliked.includes(userId); //vérifie que l'utilisateur est présent dans la liste "likes"

  //a voir pour une refactorisation plus performante

  // gestion du like === 0 et reset de la requete user
  if (hasLike) {
    mySauce.likes = mySauce.likes - 1;
    mySauce.usersLiked = mySauce.usersLiked.filter((id) => id !== userId);
  }
  if (hasDislike) {
    mySauce.dislikes = mySauce.dislikes - 1;
    mySauce.usersDisliked = mySauce.usersDisliked.filter((id) => id !== userId);
  }

  // cas de like
  if (like === 1) {
    mySauce.likes = mySauce.likes + 1;
    mySauce.usersLiked.push(userId);
  }

  // cas de dislike
  if (like === -1) {
    mySauce.dislikes = mySauce.dislikes + 1;
    mySauce.usersDisliked.push(userId);
  }
  //sauvegarde des likes/dislikes de la sauce
  await mySauce.save().catch((error) => res.status(401).json({ error }));

  res.status(200).json({ message: " likes update !" });
};
