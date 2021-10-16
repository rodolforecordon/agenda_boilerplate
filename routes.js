const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contactController = require('./src/controllers/contactController');

// Home routers
route.get('/', homeController.landingPage);
route.post('/', homeController.logIn);

// Contact routers
route.get('/contact', contactController.homePage);

module.exports = route;