const express = require('express');
const mongoose = require('mongoose');

const Sauce = require('./models/Sauce');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  next();
});




mongoose.connect('mongodb+srv://quentinR:OcProject6@cluster0.rzzmts9.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
  });
  
  
app.use((req, res, next) => {
  res.status(201);
  next();
});


app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;