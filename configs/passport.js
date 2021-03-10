const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

//Set the user in the session after login
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});


//Passport - Get the user from the session
//req.user - can get info from the use with this function:
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

//Passport - Local authentication
//tries to find the user, if no user set the error
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!foundUser) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    next(null, foundUser);
  });
}));

//Passport - Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //The user got authenticated by user
      User.findOne({ googleId: profile.id })
        .then(user => {
          if (user) {
            //Authenticate and persist in session
            done(null, user);
            return;
          }
          User.create({ googleId: profile.id, username: profile.displayName })
            .then(newUser => {
               //Authenticate and persist in session
              done(null, newUser);
            })
            .catch(err => done(err)); 
        })
        .catch(err => done(err)); 
  }
))



