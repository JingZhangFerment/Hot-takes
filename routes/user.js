//Ce fichier contient la logique des routes pour les utilisateurs.

//---------IMPORTS--------------
const express = require("express"); //pour créer les applis web avec node
const userCtrl = require("../controllers/user"); //import du controlleur "user"

//import du middleware pour mettre une limite au niveau des tentatives de login échouées
const connexion = require("../middleware/connexion"); 
//import du middleware pour contrôler le mot de passe
const password = require("../middleware/password"); 
//import du middleware pour contrôler les emails
const email = require("../middleware/email");

const router = express.Router(); // permet de créer du router

//---------CREATION DES ROUTES --------------
router.post ("/signup", email, password, userCtrl.signup); //créer un compte
router.post ("/login", email, password, connexion, userCtrl.login); //se connecter sur un compte déjà créé


// ----------EXPORT------------------
module.exports = router; //exporter ce module "router" pour le réutiliser ailleurs