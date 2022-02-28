const express = require ("express");

const app = express ();

app.use((req, res)=> {
 res.json({ message: "votre requête a bien été enregistré!" });
});

module.exports = app;