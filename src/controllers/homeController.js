exports.landingPage = (req, res) => {
  res.render('index');
  return;
}

exports.logIn = (req, res) => {
  res.send('req.body');
}