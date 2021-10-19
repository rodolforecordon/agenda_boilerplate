exports.landingPage = (req, res) => {
  res.render('index', {
    title: 'injected title',
    numbers: [0, 1, 2, 3, 4, 5]
  });
  return;
}

exports.logIn = (req, res) => {
  res.send('req.body');
}