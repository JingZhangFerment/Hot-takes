const mySauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const mySauce = new sauce({
    ...req.body,
  });
  mySauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistrée!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  mySauce
    .updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then((mySauce) => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  mySauce
    .deleteOne({ _id: req.params.id })
    .then((mySauce) => res.status(200).json({ message: "Sauce supprimée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  mySauce
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  mySauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
