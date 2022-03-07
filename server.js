//-------------IMPORTS-----------------

//import du package 'http'
const http = require("http");

//import de l'application express
const app = require("./app");

//import "dotenv": charger les variables d'environnement stockées dans le fichier .env
const dotenv = require("dotenv");
dotenv.config();

//-------------CONFIGURATION DU PORT-----------------
//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.Port || "3000");

//sur quel port le serveur tourne
app.set("port", port);

//création de la fonction pour la gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//créer un serveur avec Node
const server = http.createServer(app);

//--------------CONNEXION AU PORT---------------
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;
  console.log("listening on" + bind);
});

//écoute du port
server.listen(port);