//Ce fichier contient la logique métier pour les sauces (méthodes attribuées aux routes)

//---------IMPORTS-------------------

// importer le package "jsonwebtoken" pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");
// importer le modèle des données sauces
const Sauce = require("../models/sauce");
//importer le package "file system" qui permet de modifer le system des fichiers.
const fs = require("fs");
const sauce = require("../models/sauce");

// -----MIDDLEWARE pour créer une sauce ------------
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    userLiked: [" "],
    userDisliked: [" "],
  });
  sauce
    .save()
    .then((sauce) => res.status(201).json({ message: "Sauce enregistrée!" }))
    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour modifier une sauce ------------
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
        });

        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then((sauce) =>
            res.status(200).json({ message: "Sauce modifiée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// -----MIDDLEWARE pour supprimer une sauce ------------
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res
          .status(404)
          .json({ error: new Error("Sauce non trouvée !") });
      }

      if (sauce.userId && sauce.userId !== req.auth.userId) {
        return res
          .status(403)
          .json({ error: new Error("Requête non autorisée !") });
      }

      const filename = sauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then((Sauce) =>
            res.status(200).json({ message: "Sauce supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour voir une sauce ------------
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour voir toutes les sources ------------
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour la gestion des likes et dislikes ------------
exports.likeASauce = (req, res, next) => {
  //trouver la sauce dans la base des données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

      //définir le status d'un utilisateur
      const userStatus = {
        userLiked: sauce.userLiked,
        userDisliked: sauce.userDisliked,
        likes: 0,
        dislikes: 0,
      };

      // 3 cas possibles selon la valeur de "like"
      switch (req.body.like) {
        case 1: // si l'utilisateur aime la sauce
        userStatus.userLiked.push(req.body.userId); //ajouter dans le tableau "userLiked"
          break;

        case -1: //si l'utilisateur n'aime pas la sauce
          userStatus.userDisliked.push(req.body.userId); //ajouter dans le tableau "userDisliked"
          break;

        case 0: // l'utilisateur annule son like ou dislike
          // si l'utilisateur annule son like, retirer-le du tableau "userLiked"
          if (req.body.userId in userStatus(userLiked)) {
            let indexLiked = userStatus.userLiked.indexOf(userId);
            userStatus.userLiked.splice(index, 1); //supprimer 1 élément à partir de l'index "index"
          } else {
            //si l'utilisateur annule son dislike, retirer-le du tableau "userDisliked"
            let indexDisliked = userStatus.userDisliked.indexOf(userId);
            userStatus.userDisliked.splice(index, 1);
          }
          break;
          
        default:
          throw error;
      }

      //calculer le nombre total de likes et dislikes
      userStatus.likes = userStatus.userLiked.length;
      userStatus.dislikes = userStatus.userDisliked.length;

      //mettre à jour la sauce avec les nouveaux status
      Sauce.updateOne({ _id: req.params.id }, userStatus)
        .then((sauce) =>
          res.status(200).json({ message: "La sauce a bien été notée!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};


