require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('##### Connected to MongoDB #####');
    app.emit('dbReady');
  })
  .catch(e => console.log(e));

const routes = require('./routes');
const path = require('path');
const { globalMiddleware } = require('./src/middlewares/middleware');

// setting up express to deal with req.body
app.use(express.urlencoded({ extended: true }));

// setting up express to find static files folder
app.use(express.static(path.resolve(__dirname, 'public')));

// setting up express to use the views folder and engine
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// setting up a global middleware that is called for all routes
app.use(globalMiddleware);
// setting up routers
app.use(routes);

app.on('dbReady', () => {
  app.listen(3000, () => {
    console.log('Access http://localhost:3000');
    console.log('Server is listening...');
  });
});