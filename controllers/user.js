//Ce fichier contient la logique métier pour les utilisateurs

//pour charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

//---------IMPORTS-------------------

const bcrypt = require("bcrypt"); //importer le package de chiffrement bcrypt
const User = require("../models/user"); // importer le schéma des données utilisateurs

// importer le package "jsonwebtoken" pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");

//MIDDLEWARE POUR L'INSCRIPTION DES UTILISATEURS
exports.signup = (req, res, next) => {
  // Hachage du mot de passe et le "saler" 10 fois
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const sauceUser = new User({
        email: req.body.email,
        password: hash,
      });

      sauceUser
        .save()
        .then((sauceUser) =>
          res.status(201).json({ message: "Utilisateur créé et sauvegardé !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//MIDDLEWARE POUR CONNECTER LES UTILISATEURS EXISTANTS
exports.login = (req, res, next) => {
  //vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données
  User.findOne({ email: req.body.email })
    .then((sauceUser) => {
      if (!sauceUser) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      //comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
      bcrypt
        .compare(req.body.password, sauceUser.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: sauceUser._id,
            //sign() : encoder le nouveau token qui contient l'ID de l'utilisateur en tant que payload
            token: jwt.sign(
              { userId: sauceUser._id },
              process.env.SECRET_TOKEN,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
