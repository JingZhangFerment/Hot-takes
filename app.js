//Ce fichier contient la logique globale de notre application.

//import "dotenv": charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

const express = require("express"); //pour créer les applis web avec node

//faciliter les interations entre l'application Express et la base de données MongoDB.
const mongoose = require("mongoose"); 

//sécuriser les en-tête http de l'application express
const helmet = require("helmet");

//nettoyer les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
const mongoSanitize = require("express-mongo-sanitize");

//donner accès au chemin de fichiers
const path = require("path");

//parcours des sauces
const sauceRoutes = require("./routes/sauce");

//parcours des utilisateurs
const userRoutes = require("./routes/user");

//--------CONNEXTION l'API A LA BASE DES DONNEES MONGODB -------------
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//faire appel au module "Express" avec sa fonction
const app = express();

//gérer les requêtes 'POST' venant du frontend : besoin d'extraire le corps JSON des requêtes
//Express prend les requêtes qui ont comme Content-Type application/json et met à disposition leur body directement sur l'objet req
app.use(express.json()); 

//permettre aux deux ports (front et end) de communiquer entre eux
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //permet d'accéder l'API depuis n'importe quelle origine ('*')
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); //ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPINIONS "
  ); //Permet d'envoyer des requêtes avec les méthodes mentionnées
  next();
});

//protèger l'appli de certaines vulnerabilités en configurant les en-têtes
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//supprimer les caractères "$" et "." dans les données fournies par l'utilisateur dans les endroits suivants:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(mongoSanitize());

//----------------------CONFIGURATION DES ROUTES API----------------------------

//gérer la ressource "images" de manière statique à chaque fois qu'elle reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));

//enregistrement des routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//export ce module "app" pour y accéder depuis les autres fichiers
module.exports = app;
