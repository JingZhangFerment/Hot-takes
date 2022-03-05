const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//importer "helmet" pour protéger l'app de certaines des vulnérabilités du Web en configurant de manière appropriée des en-têtes HTTP.
const helmet = require("helmet");
const path = require("path");

const app = express();

//configurer le cors : autoriser uniquement les requêtes provenant de "http://127.0.0.1:8081/" 
const cors = require("cors");
const corsOptions = {
  origin: "http://127.0.0.1:8081/"
};

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

//Connecter l'API au MongoDB
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(cors(corsOptions));

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

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
