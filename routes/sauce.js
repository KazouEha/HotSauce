const express = require('express');
const saucesRoutes = express.Router();
const {
    getAllSauce,
    createSauce,
    getOneSauce,
    deleteSauce,
    modifySauce,
    likeOrDislikeSauce,
} = require("../controllers/sauce");
const { validAuth } = require('../middleware/auth');
const  multer  = require('../middleware/multer-config');

//we use express.Router to redirect the request and we use the middleware ValidAuth to verify if the user is authorized
saucesRoutes.use(validAuth);

saucesRoutes.get('/', getAllSauce);
saucesRoutes.post('/', multer, createSauce);
saucesRoutes.get('/:id', getOneSauce);
saucesRoutes.put('/:id', multer, modifySauce);
saucesRoutes.delete('/:id', deleteSauce);
saucesRoutes.post('/:id/like', likeOrDislikeSauce);

module.exports = saucesRoutes;