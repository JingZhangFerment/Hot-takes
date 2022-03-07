//importer le package validator
const emailValidator = require("validator");

//vérifier si l'email est valide
module.exports = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une addresse email valide !" });
  } else {
      next();
  }
};