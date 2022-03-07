//Ce fichier contient la logique globale de notre application.

//--------------------IMPORTS--------------------

//pour charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

const express = require("express"); //pour créer les applis web avec node
const mongoose = require("mongoose"); //pour faciliter les interations avec MONGODB

//pour sécuriser les en-tête http de l'application express
const helmet = require("helmet");

//pour autoriser uniquement les requêtes provenant de "http://127.0.0.1:8081/"
const cors = require("cors");
const corsOptions = {
  origin: "http://127.0.0.1:8081/",
};

//nettoyer les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
const mongoSanitize = require("express-mongo-sanitize");

//pour donner accès au chemin de fichiers
const path = require("path");

//pour le parcours des sauces
const sauceRoutes = require("./routes/sauce");

//pour le parcours des utilisateurs
const userRoutes = require("./routes/user");

//--------CONNEXTION l'API A LA BASE DES DONNEES MONGODB -------------
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Faire appel au module "Express" avec sa fonction
const app = express();

//Gestion des requêtes 'POST' : qui permet d'accéder aux corps de la requête
app.use(express.json()); // Intercepter toutes les requêtes qui ont un content-type json.

//Pour permettre aux deux ports (front et end) de communiquer entre eux
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //permet d'accéder l'API depuis n'importe quelle origine ('*')
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); //autorisation d'utiliser certains headers sur l'objet requête
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPINIONS "
  ); //Permet d'envoyer des requêtes avec les méthodes mentionnées
  next();
});

//Sécuriser les en-têtes HTTP de notre app Express
app.use(cors(corsOptions));

//protèger l'appli de certaines vulnerabilités en configurant les en-têtes
app.use(helmet());

//supprimer les caractères "$" et "." dans les données fournies par l'utilisateur dans les endroits suivants:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(mongoSanitize());

//----------------------CONFIGURATION DES ROUTES API----------------------------

//Gérer la ressource "images" de manière statique à chaque fois qu'elle reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));

//enregistrement des routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//Export ce module "app" pour le réutiliser ailleurs
module.exports = app;
