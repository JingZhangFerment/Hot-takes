//Ce fichier contient la configuration pour protéger les routes en vérifiant l'authentification avant envoi requêtes 

//pour charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

//pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
    // recuperer le token dans le header authorization
    // avec split : retourne un tableau avec 'Bearer' en 1e element et le token en 2e element
    // on recupere seulement le 2è element de ce tableau : le token
    const token = req.headers.authorization.split(" ")[1];
    
    // décoder le token avec fonction verify de jwt, le token payload et sa clé secrète en argument 
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    
    // Récupérer du userId encodé dans le token
    const userId = decodedToken.userId;
    //ajout d'un attribut à l'objet "request" le rend accessible à tous les middlewares
    req.auth = { userId: userId };

    // Comparer l'userId de la requête avec celui du token
    if (req.body.userId && !req.body.userId == userId) {
      throw "Identifiant non valide!";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
