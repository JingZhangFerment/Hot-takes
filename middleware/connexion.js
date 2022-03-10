//import le package "express-rate-limit"
const limit = require ("express-rate-limit");

//configuration du middleware pour limiter les tentatives de connexion échoués
const connexionLimit = limit({
    windowMs: 15 * 60 * 1000, // 15 minutes: en ms
	max: 3, // limiter chaque ID à 3 tentatives
    message: "Votre compte est bloqué pendant quelques minutes suite aux tentatives de connexion échoués."
});

//export du module
module.exports = connexionLimit;
