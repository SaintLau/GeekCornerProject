require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');


//Include passport configuration
require('./configs/passport');


mongoose
  .connect(process.env.MONGODB_URI,
  {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set up the session
/* app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,

  cookie: {
    sameSite: true, //the request is on the same domain
    secure: false, //do not uses https
    httpOnly: true, //site on only http
    maxAge: 60000 //time cookie lives
  },
  rolling: true //session refresh has you go
})) */

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    sameSite: true, //'none', //the requester is on the same domain
    secure: false, //true,//false, //not using https
    httpOnly: true, //false, true, //site on only on http
    maxAge: 60000 //coolie time to live
  },
  rolling: true //session gets refreshed
}))

//Initializes passport
app.use(passport.initialize());
//Initializes passport session
app.use(passport.session());
  

//require cors - ALLOW FRONTEND TO GET RESOURCES FROM OUR BACKEND (API)
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_HOSTNAME] 
  })
)



//Access Token from Twitch
//  app.use({
//     origin: [process.env.client_id]
//})


//Express view engine setup



const index = require('./routes/index');
app.use('/', index);

//import the route game-routes
const gameRoutes = require('./routes/game-routes');
app.use('/api', gameRoutes); //api because all will be here and people will know

//import the route for anime-routes
const animeRoutes = require('./routes/anime-routes');
app.use('/api', animeRoutes);

//authentication routes from auth-routes
const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);


module.exports = app;
