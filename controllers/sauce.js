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
    console.log("file", file);
    // const { fileName } = file.path;
    const sauce = JSON.parse(body.sauce);
    console.log(sauce);
    const {
        name, manufacturer, description, mainPepper, heat, userId
    } = sauce;
    const sauceModel = new Sauce({
      userId: userId,
      name: name,
      description: description,
      manufacturer: manufacturer,
      mainPepper: mainPepper,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
      heat: heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
  });
  console.log(sauceModel);
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
  const { body, file } = req;
  console.log("body modif", body);
  console.log("path", file);
  const sauce = new Sauce({
    _id: req.params.id,
    name: body.name,
    manufacturer: body.manufacturer,
    mainPepper: body.mainPepper,
    description: body.description,
    heat: body.heat,
    userId: body.userId
  });
  if(file !== undefined){
    sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      console.log("sauce modifiée", sauce)
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

exports.likeOrDislikeSauce = (req, res, next) => {
    console.log("id findone", req.body);
    const likeOrDislike = req.body.like;
    const user = req.body.userId;
    Sauce.findOne({_id: req.params.id })
        .then(sauce => {
            console.log("sauce find", sauce);
            console.log("likeordislike", likeOrDislike);
            switch(likeOrDislike) {
                case 1:
                    if(sauce.usersLiked.includes(user)){
                        console.log("coucou", likeOrDislike);
                        console.log("401 not authorized");
                        res.status("401").json({message: 'Not authorized'});
                    }else{
                       console.log("ça push", user);
                        sauce.likes += 1;
                        sauce.usersLiked.push(user);
                    }
                    break;
                case 0:
                    if(sauce.usersDisliked.includes(user)){
                        console.log("test",user);
                        sauce.dislikes += -1;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(user), 1);
                    }
                    else{
                        sauce.likes += -1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(user), 1);
                    }
                    break;
                case -1: 
                    if(sauce.usersDisliked.includes(user)){
                        console.log("401 not authorized");
                        res.status("401").json({message: 'Not authorized'});
                    }else{
                        console.log("-1", user);
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(user);
                    }
                    break;
            }
            Sauce.updateOne({_id: sauce._id}, sauce)
                .then(() =>  {res.status(200).json({message: 'Choix confirmé'})})
                .catch(error => {res.status(500).json({error})})
        })
        .catch(error => {res.status(500).json({error})});
}

