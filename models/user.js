//Ce fichier contient le schéma des données utilisateurs pour la base de données MongoDB

//---------IMPORTS----------------

//pour faciliter les interations avec MONGODB
const mongoose = require("mongoose");
//pour améliore les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require("mongoose-unique-validator");

//---------SCHEMA DES DONNEES----------------
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  //la valeur "unique" s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
  password: { type: String, required: true },
});

//-----------APPLICATION DU PLUG-IN AU SCHEMA DE DONNEES------------
// mongoose-unique-validator s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
userSchema.plugin(uniqueValidator); 

//transformer ce model avec en arguments ("nom du modèle", "nom du schéma") en un modèle utilisable
module.exports = mongoose.model("User", userSchema);

