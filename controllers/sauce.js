const jwt = require("jsonwebtoken");
const Sauce = require('../models/Sauce.js');
const multer = require ('multer');


/**
 * get all sauces from api
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  /**
   * Create a sauce in the database images not working yet
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
exports.createSauce = (req, res, next) => {
    
    const { body, file } = req;
    console.log(body.sauce);
    const { fileName } = file;
    const sauce = JSON.parse(body.sauce);
    const {
        name, manufacturer, description, mainPepper, heat, userId
    } = sauce;
    const sauceModel = new Sauce({
      userId: userId,
      name: name,
      description: description,
      manufacturer: manufacturer,
      mainPepper: mainPepper,
      imageUrl: "https://picsum.photos/200/300",
      heat: heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
  });
  sauceModel.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


/**
 * get one sauce from api using sauce id
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


/**
 * delete sauce from the database
 * works
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteSauce = (req, res, next) => {
    
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

