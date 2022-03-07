//Ce fichier contient la logique des routes pour les sauces.

//---------IMPORTS--------------

const express = require("express"); //pour créer les applis web avec node
const sauceCtrl = require("../controllers/sauce"); //import du controlleur "sauce"
const auth = require("../middleware/auth"); //import du middleware d'authentification
const multer = require("../middleware/multer-config"); //import du middleware "multer"


const router = express.Router(); // permet de créer du router

//---------CREATION DES ROUTES (CRUD: create/read/update/delete) --------------

//créer une sauce + obligation d'authentifier + multer pour les images entrants
router.post("/", auth, multer, sauceCtrl.createSauce); 

//modifier une sauce, seul l'utilisateur créé la sauce peut la modifier, multer pour les images entrants
router.put("/:id", auth, multer, sauceCtrl.modifySauce); 

//supprimer une sauce, seul l'utilisateur créé la sauce peut la supprimer
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//afficher une sauce par son id
router.get("/:id", auth, sauceCtrl.getOneSauce); 

//afficher toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces); 

//gérer les "likes" et "dislikes"
router.post("/:id/like", auth, sauceCtrl.likeASauce); 

// ----------EXPORT------------------
module.exports = router;  //exporter ce module "router" pour le réutiliser ailleurs