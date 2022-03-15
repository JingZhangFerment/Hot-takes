//Ce fichier contient la logique métier pour les sauces (méthodes attribuées aux routes)

//---------IMPORTS-------------------

// importer le package "jsonwebtoken" pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");
// importer le modèle des données sauces
const Sauce = require("../models/sauce");
//importer le package "file system" qui permet de modifer le system des fichiers.
const fs = require("fs");

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
  //s'il y a une modification de fichier, supprimer-le d'abord.
  if (req.file) {
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
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            throw new Error(error);
          }
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }

  //mise à jour la base des données lors de modification
  //une condition pour deux cas: avec une modification de l'image ou sans
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  //modifier le fichier
  Sauce.updateOne(
    //trouver la même sauce avec le nouvel objet
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then((sauce) => res.status(200).json({ message: "Sauce bien modifiée !" }))
    .catch((error) => res.status(400).json(error));
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
  //méthode find() permet de renvoyer un tableau contenant tous les sauce dans la base de données
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
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };

      // 3 cas possibles selon la valeur de "like"
      switch (req.body.like) {
        case 1: // si l'utilisateur aime la sauce et qu'il n'a pas encore liké
          if (
            !(req.body.userId in userStatus.usersLiked) &&
            req.body.like === 1
          ) {
            userStatus.usersLiked.push(req.body.userId); //ajouter dans le tableau "userLiked"
          }
          break;

        case -1: //si l'utilisateur n'aime pas la sauce et qu'il n'a pas encore disliké
          if (
            !(req.body.userId in userStatus.usersDisliked) &&
            req.body.like === -1
          ) {
            userStatus.usersDisliked.push(req.body.userId);
          } //ajouter dans le tableau "userDisliked"
          break;

        case 0: // l'utilisateur annule son like ou dislike ou position neutre
          // si l'utilisateur annule son like, retirer-le du tableau "userLiked"
          if (userStatus.usersLiked.includes(req.body.userId)) {
            //indexer l'userID
            let indexLiked = userStatus.usersLiked.indexOf(req.body.userId);
            userStatus.usersLiked.splice(indexLiked, 1); //supprimer 1 élément à partir de l'index "index"
          } else if (userStatus.usersDisliked.includes(req.body.userId)) {
            //si l'utilisateur annule son dislike, retirer-le du tableau "userDisliked"
            let indexDisliked = userStatus.usersDisliked.indexOf(
              req.body.userId
            );
            userStatus.usersDisliked.splice(indexDisliked, 1);
          }
          break;

        default:
          throw error;
      }

      //calculer le nombre total de likes et dislikes
      userStatus.likes = userStatus.usersLiked.length;
      userStatus.dislikes = userStatus.usersDisliked.length;

      //mettre à jour la sauce avec les nouveaux status
      Sauce.updateOne({ _id: req.params.id }, userStatus)
        .then((sauce) => res.status(200).json({ message: "Sauce bien notée!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
