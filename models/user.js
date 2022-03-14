//Ce fichier contient le schéma des données utilisateurs pour la base de données MongoDB

//---------IMPORTS----------------

//faciliter les interations avec MONGODB
const mongoose = require("mongoose");
//prévalider les informations avant de les enregistrer
const uniqueValidator = require("mongoose-unique-validator");

//---------CREATION SCHEMA DES DONNEES----------------
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, //"unique" s'assure que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
});

//-----------APPLICATION DU PLUG-IN AU SCHEMA DE DONNEES------------
// mongoose-unique-validator s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
userSchema.plugin(uniqueValidator);

//transformer ce model avec en arguments ("nom du modèle", "nom du schéma") en un modèle utilisable
module.exports = mongoose.model("User", userSchema);
