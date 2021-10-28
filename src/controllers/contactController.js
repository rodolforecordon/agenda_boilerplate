const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
  res.render('contact');
};