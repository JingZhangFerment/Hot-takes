const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const mySauce = require("./models/sauce");
const sauce = require("./models/sauce");

//Connecter l'API au cluster MongoDB
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPINIONS "
  );
  next();
});

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const mySauce = new sauce ({
    ...req.body
  })
  mySauce.save()
  .then(() => res.status(201).json({message: "sauce enregistrée!"}))
  .catch(error => res.status(400).json({error}));
});

//Renvoie un tableau de toutes les sauces de la base de données.
app.get("/api/sauces", (req, res, next) => {
  mySauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));
  
});

app.get ("/api/sauces/:id", (req, res, next) => {
  mySauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({error}));
})

app.put ("/api/sauces/:id", (req, res, next) => {
  mySauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
  .then((mySauce)=> res.status(200).json({message: "Sauce modifiée !"}))
  .catch(error => res.status(400).json({error}));
})

app.delete ("/api/sauces/:id", (req, res, next) => {
  mySauce.deleteOne ({_id: req.params.id})
  .then ((mySauce)=> res.status(200).json({message: "Sauce supprimée !"}))
  .catch(error => res.status(400).json({error}));
})

module.exports = app;
