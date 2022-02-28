//importer le package http de node qui nous permettra de créer un serveur 
const http = require ("http");
const app = require ("./app");


app.set("port", 3000);
const server = http.createServer(app);

server.listen (3000);