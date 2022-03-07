//pour charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

//pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header authorization de "En-tête de requête"
    const token = req.headers.authorization.split(" ")[1];
    
    // Décodage du token 
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    
    // Récupération du userId encodé dans le token
    const userId = decodedToken.userId;
    //ajout d'un attribut à l'objet "request" le rend accessible à tous les middlewares
    req.auth = { userId: userId };

    // Comparaison du userId de la requête avec celui du token
    if (req.body.userId && !req.body.userId == userId) {
      throw "Identifiant non valide!";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
