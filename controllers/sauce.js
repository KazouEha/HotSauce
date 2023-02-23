const Sauce = require('../models/Sauce.js');
const fs = require('fs');

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
  )
  
  .catch(
    (error) => {
      res.status(400).json({error: error});
    }
  );

};

  /**
   * Create a sauce in the database
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
exports.createSauce = (req, res, next) => {

  const { body, file } = req;

  //When a file is added, need to parse body.sauce because it comes as a string
  const sauce = JSON.parse(body.sauce);

  const {
      name, manufacturer, description, mainPepper, heat
  } = sauce;

  //use mongoose model to create a new sauce
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

  //save the new sauce on the database thanks to the model
  sauceModel.save()
  .then(() => { res.status(201).json({message: 'Sauce registered!'})})

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
  })
  
  .then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  )
  
  .catch(
    (error) => {
      res.status(404).json({ error: error });
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

    //first verify authentification before action
    if(sauce.userId === req.auth.userId){

      const oldImgUrl = sauce.imageUrl;

      if(req.file){

        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
        updateTheSauce()});

      } else {

        updateTheSauce(oldImgUrl);

      }
    } else {

      res.status("401").json({message: 'Not authorized'});

    }

  })

  .catch(
    (error) => {
      res.status(404).json({error: error});
    }

  );
  
  
  /**
   * when you get the original image url you can update the sauce
   * 
   * @param {*} url 
   */
  function updateTheSauce(url = null){
    
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
    
    // get original file url if new url is filename is empty
    const imageUrl = file ? `${req.protocol}://${req.get('host')}/images/${file.filename}` : url;

    const sauceUpdate = {
      name: name,
      manufacturer: manufacturer,
      mainPepper: mainPepper,
      description: description,
      heat: heat,
      imageUrl: imageUrl,
    };

    //update the sauce in the database 
    Sauce.updateOne({_id: req.params.id, userId: req.auth.userId}, sauceUpdate)
    
    .then(
      () => {
          res.status(201).json({message: 'Sauce updated successfully!'});
      }
    )
    
    .catch(
      (error) => {
        res.status(400).json({error: error});
      }
    );
  }

};


/**
 * delete sauce from the database
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteSauce = (req, res, next) => {
  
  Sauce.findOne({
    _id: req.params.id
  })

  .then((sauce) => {
    //first verify authentification before action
    if(sauce.userId === req.auth.userId)
      {

        const filename = sauce.imageUrl.split("/images/")[1];

        //unlink the file with imageUrl then delete the file in "images" folder
        fs.unlink(`images/${filename}`, () => {

          //delete from the database
          Sauce.deleteOne({_id: req.params.id})
          
          .then( () => { res.status(200).json({message:'Deleted!'})})
          
          .catch( (error) => { res.status(400).json({ error: error })})
        })
  
      } else {

        res.status("401").json({message: 'Not authorized'});

      }
      
  })

  .catch(
    (error) => {
      res.status(404).json({error: error});
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
                  //first verify if it has already been liked, if not, add to count and add userId in array
                  if(sauce.usersLiked.includes(user)){
                      res.status("401").json({message: 'Not authorized'});
                  }else{
                      sauce.likes += 1;
                      sauce.usersLiked.push(user);
                  }
                  break;

              case 0:
                  //first test is on usersDisliked array, if no user then when we work on usersLiked array
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
                  //first verify if it has already been disliked, if not, add to count and add userId in array
                  if(sauce.usersDisliked.includes(user)){
                      res.status("401").json({message: 'Not authorized'});
                  }else{
                      sauce.dislikes += 1;
                      sauce.usersDisliked.push(user);
                  }
                  break;
          }
          //update in the data base
          Sauce.updateOne({_id: sauce._id}, sauce)
              .then(() =>  {res.status(200).json({message: 'Choix confirmé'})})
              .catch(error => {res.status(500).json({error})})
      })

      .catch(error => {res.status(500).json({error})});
  
}

