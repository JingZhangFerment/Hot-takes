//Ce fichier contient le schéma des mots de passe

//importer le package "password-validator"
const passwordValidator = require("password-validator");

//création du schéma
const passwordSchema = new passwordValidator();

//---------SCHEMA DES MOTS DE PASSE----------------
passwordSchema
  .is().min(8) // Longueur minimal 8
  .is().max(20) // Longueur maximal 20
  .has().uppercase(1) // au moins une lettre en majuscule
  .has().lowercase(1) // au moins une lettre en minuscule
  .has().digits(1) // au moins un chiffre
  .has().not().spaces() // pas d'espaces
  .is().not().oneOf(["Passw0rd", "Password123"]); // Blacklist des mots de passe

///transformer ce model en un modèle utilisable
module.exports = passwordSchema;