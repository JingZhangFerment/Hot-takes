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

  //renommer le fichier afin d'éviter le risque d'avoir deux fichiers entrants qui ont les mêmes noms 
  filename: (req, file, callback) => {
    //indiquer à multer d'utiliser le nom d'origine, de remplacer les espaces par "_" et d'ajouter un timestamp "Date.now()" comme nom de fichier
    const name = file.originalname.split(" ").join("_");
    
    const extension = MIME_TYPES[file.mimetype];
    //argument 1 du callback: "null" = pas d'erreur
    //argument 2 du callback: nom de fichier entier = name + timestamp Date.now() + extension
      callback(null, name + Date.now() + "." + extension);
  },
});

//Si le format de l'image n'est pas valide
const fileFilter = (req, file, callback) =>{
  // ne pas accepter les mimetype qui ne sont pas des images.
  if (!(file.mimetype in MIME_TYPES)) {
   callback(new Error("Le format de l'image n'est autorisé !"))
  }
  callback(null, true)
}

//exporter "multer" en appelant le module storage
//.single signifie que c'est un fichier unique et non un groupe de fichiers
// "image" pour indiquer à multer qu'il s'agit d'un fichier image uniquement
module.exports = multer({
  storage,
  fileFilter,
  //spécifier les limites peut aider à protéger le site contre les attaques par déni de service (DoS).
  limits: { fileSize: 500000 },
}).single("image");
