const Sauce = require("../models/Sauce");

exports.createSauce = (req, res, next) => {
  JSON.parse(req.body.sauce);
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
  console.log(req.sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => {
      res.status(400).json({ error: "creating arborded" });
    });
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
  const sauce = await Sauce.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then((sauce) => {
      res.status(201).json({ message: "Sauce updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error });
      throw new Error(" sauce can't be update ! ");
    });
};

exports.deleteSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.deleteOne({ _id: req.params.id }).then(
      (sauce) => {
        res.status(200).json({ message: "Sauce Deleted!" });
      }
    );
  } catch (error) {
    res.status(400).json({ error });
    throw new Error("Can't delete sauce");
  }
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
