const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer:  { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: {type: Array, required: true},
});

module.exports = mongoose.model('Sauce', sauceSchema);

// API Routes
// Toutes les routes sauce pour les sauces doivent disposer d’une autorisation (le
// token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »).
// Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code
// doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne
// correspond pas, renvoyer « 403: unauthorized request. » Cela permet de s'assurer
// que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.
// Data ModelsSauce
// ● userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la
// sauce
// ● name : String — nom de la sauce
// ● manufacturer : String — fabricant de la sauce
// ● description : String — description de la sauce
// ● mainPepper : String — le principal ingrédient épicé de la sauce
// ● imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
// ● heat : Number — nombre entre 1 et 10 décrivant la sauce
// ● likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
// ● dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la
// sauce
// ● usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
// qui ont aimé (= liked) la sauce
// ● usersDisliked : [ "String <userId>" ] — tableau des identifiants des
// utilisateurs qui n'ont pas aimé (= disliked) la sauce