const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require ('cors');
const bodyParser = require('body-parser');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();
const router = express.Router();

mongoose.connect('mongodb+srv://kazou:kazou@hotsaucep6.dqpylwm.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;