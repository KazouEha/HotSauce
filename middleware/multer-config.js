const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//if file then file is saved in the folder images and renamed with name, sauce name and extension
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const sauce = JSON.parse(req.body.sauce);
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const newName = name + '.' + sauce.name + '.' + extension;
    const finalName = newName.split(' ').join('_');
    callback(null, finalName);
  }
});

module.exports = multer({storage: storage}).single('image');