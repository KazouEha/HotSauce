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

    const sauce = JSON.parse(body.sauce);

    const {
        name, manufacturer, description, mainPepper, heat
    } = sauce;

    const sauceModel = new Sauce({
      userId: req.auth.userId,
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

/**
 * get the actual image url before modifying the sauce
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modifySauce = (req, res, next) => {
  
  Sauce.findOne({
    _id: req.params.id
  })
  .then((sauce) => {
    const oldImgUrl = sauce.imageUrl;
    console.log(oldImgUrl);
    updateTheSauce(oldImgUrl);
  })
  .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
  
  /**
   * when you get the original image url you can update the sauce
   * 
   * @param {*} url 
   */
  function updateTheSauce(url){
    
    const file  = req.file;

    //verify if the picture is changed or not
    if(file){
      var body = JSON.parse(req.body.sauce);
    }else{
      var body = req.body;
    }
  
    const {
        name, manufacturer, description, mainPepper, heat
    } = body;
    
  
    const imageUrl = file ? `${req.protocol}://${req.get('host')}/images/${file.filename}` : url;
    
    const sauceUpdate = {
      name: name,
      manufacturer: manufacturer,
      mainPepper: mainPepper,
      description: description,
      heat: heat,
      imageUrl: imageUrl,
    };

    Sauce.updateOne({_id: req.params.id, userId: req.auth.userId}, sauceUpdate).then(
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
  }

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

  const likeOrDislike = req.body.like;

  const user = req.body.userId;

  Sauce.findOne({_id: req.params.id })
      .then(sauce => {
          switch(likeOrDislike) {
              case 1:
                  if(sauce.usersLiked.includes(user)){
                      res.status("401").json({message: 'Not authorized'});
                  }else{
                      sauce.likes += 1;
                      sauce.usersLiked.push(user);
                  }
                  break;
              case 0:
                  if(sauce.usersDisliked.includes(user)){
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
                      res.status("401").json({message: 'Not authorized'});
                  }else{
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

