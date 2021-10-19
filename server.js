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
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { globalMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// setting up express to use helmet to prevent attacks
app.use(helmet());

// setting up express to deal with req.body
app.use(express.urlencoded({ extended: true }));

// setting up express to find static files folder
app.use(express.static(path.resolve(__dirname, 'public')));

// setting up session
const sessionOption = session({
  secret: 'hfalfeAfaehgalnVAEhlSD490)_(*(awlkvalkj',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOption);
app.use(flash());

// setting up express to use the views folder and engine
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// setting up express to use csurf and prevent attacks
app.use(csrf());

// setting up middlewares and routes
app.use(globalMiddleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('dbReady', () => {
  app.listen(3000, () => {
    console.log('Access http://localhost:3000');
    console.log('Server is listening...');
  });
});