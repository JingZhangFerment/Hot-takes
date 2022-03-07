//importer le package "multer" qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");

//créer un objet pour les types acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//indiquer à "multer" où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  //indiquer à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  //indiquer à multer quel est le nom à utiliser pour ces fichiers
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    //si le type de fichier n'est pas dans les formats MIME_TYPES
    if (!MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new Error("Le format de l'image n'est pas valide !")
      );
    } else {
      const extension = MIME_TYPES[file.mimetype];
      //argument 1 du callback: "null" = pas d'erreur
      //argument 2 du callback: nom de fichier entier = name + timestamp Date.now() + extension
      callback(null, name + Date.now() + "." + extension);
    }
  },
});

//exporter "multer" en appelant le module storage
//.single signifie que c'est un fichier unique et non un groupe de fichiers
// "image" pour indiquer à multer qu'il s'agit d'un fichier image uniquement
module.exports = multer({
  storage: storage,
  //spécifier les limites peut aider à protéger le site contre les attaques par déni de service (DoS).
  limits: { fileSize: 500000 },
}).single("image");
