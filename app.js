const express = require("express");
const mongoose = require("mongoose");

const app = express();

//Connecter l'API au cluster MongoDB
mongoose.connect("mongodb+srv://zhang-ferment:HOTTAKES2022@cluster0.8muze.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

app.post("/api/sauces", (req, res, next) => {});

app.get((req, res, next) => {
  res.json({ message: "votre requête a bien été enregistré!" });
});

module.exports = app;
