const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
...req.body
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce created successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
      res.status(200).json(sauce);
    })
  .catch((error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id}).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Sauce Deleted!'});})

    .catch((error) => {res.status(400).json({error: error});});
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};