const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require ('cors');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();
const router = express.Router();
require('dotenv').config();
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;

//use mongoose to connect to the server using environment variable
mongoose.connect(`mongodb+srv://${user}:${password}@${dbname}.dqpylwm.mongodb.net/?retryWrites=true&w=majority`,
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

//we use path to get a static redirection for the added files
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;