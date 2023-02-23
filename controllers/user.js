const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {

    let password = req.body.password;
    //verify that the password is difficult enough and includes number and uppercases letters
    if(password.length > 5 && password.match(/[0-9]/g) && password.match(/[A-Z]/g)){
        //use bcrypt to encrypt the password before saving it on the database
        bcrypt.hash(password, 15)
            .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
        });
        //then save it on the database
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur created !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }else{

        return res.status(401).json({ error: 'Mot de passe pas assez difficile, 6 caractères minimum avec au moins un chiffre et une majuscule !' });
    
    }
}

/**
 * login function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })

    .then(user => {
    if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    //use bcrypt plugin to compare password in the body and user password in the database
    bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //if password is found in database then create a token and send to frontend
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.KEY_TOKEN,
                    { expiresIn: '24h' }
                )
            });
        })

        .catch(error => res.status(500).json({ error }));
    })

    .catch(error => res.status(500).json({ error }));

};