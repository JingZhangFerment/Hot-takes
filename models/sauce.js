//Ce fichier contient le schéma des données sauces pour la base de données MongoDB

//importer le package "mongoose" pour faciliter les interations avec MONGODB
const mongoose = require ("mongoose");

//---------CREATION SCHEMA DES DONNEES----------------
const sauceSchema = mongoose.Schema ({
    userId : {type: String, required: true },
    name: {type: String, required: true, trim: true},
    manufacturer: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    mainPepper: {type: String, required: true, trim: true},
    imageUrl: { type: String, required: true},
    heat: {type: Number, required: true, min: 1, max: 10}, 
    likes: {type: Number, required: true, default: 0},
    dislikes: {type: Number, required: true, default: 0},
    usersLiked : {type: [String], required: true, default: []}, 
    // autre possibilité: usersLiked : {type: Array, required: true, default: []}, 
    usersDisliked :{type: [String], required: true, default: []} 
    // Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
});

//transformer ce model avec en arguments ("nom du modèle", "nom du schéma") en un modèle utilisable
module.exports = mongoose.model("Sauce", sauceSchema);