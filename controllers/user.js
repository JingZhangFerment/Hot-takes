const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require ("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const sauceUser = new user ({
          email: req.body.email,
          password: hash
      });
      sauceUser.save()
      .then((sauceUser)=> res.status(201).json({message: "Utilisateur créé !"}))
      .catch(error => res.status(400).json({error}));
  })
  .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    user.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({message: "Utilisateur non trouvé !"});
      }

      bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if(!valid) {
          return res.status(401).json({message: "Mot de passe incorrect !"})
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            {userId: user._id},
            "RANDOM_SECRET_TOKEN_HOT_TAKES",
            {expireIn: "24h"}
          )
        });
      })
      .catch(error => res.status(500).json({error}));

    })
    .catch(error => res.status(500).json({error}));

};
