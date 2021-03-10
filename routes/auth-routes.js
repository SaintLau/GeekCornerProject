const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const passport = require('passport');

//Signup
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  //Server side validation on empty fields

  if (username === '' || email === '' || password === '') {
    res.status(400).json('missing fields')
    return;
  }
  //Server side validation on password constrain
  //Regular expressions
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (passwordRegex.test(password) === false) {
    res.status(400).json('weak passport');
    return;
  }
  User.findOne({username: username})
    .then((user) => {
      if (user) {
        res.status(400).json('username already exists');
        return;
      }
      //Create the user
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);
      User.create({
        username,
        email,
        password: hashPassword
      }).then((response) => {
        res.status(200).json({username: response.username, email: response.email, _id: response._id}) //to not have a breach in security
      }).catch((error) => {
        res.status(500).json(error)
        //.code is mongoose validation error
        if (error.code === 11000) {
          res.status(500).json('username should be unique')
        }
      });
    });
});

//LOGIN

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
          res.status(500).json({ message: 'Something went wrong authenticating user' });
          return;
      }
      if (!theUser) {
          // "failureDetails" contains the error messages
          // from our logic in "LocalStrategy" { message: '...' }.
          res.status(401).json(failureDetails);
          return;
      }
      // save user in session
      req.login(theUser, (err) => {
          if (err) {
              res.status(500).json({ message: 'Session save went bad.' });
              return;
          }
          // We are now logged in (that's why we can also send req.user)
          res.status(200).json(theUser);
      });
  })(req, res, next);
});

//logout
router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json('logout sucess');
});

//loggedin
router.get('/loggedin', (req, res) =>{
  if (req.isAuthenticated()){
    res.status(200).json(req.user);
    return;
  }
  res.status(200).json({});
});


//Route that will be called from front-end for google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

//Route that will be called from the google servers
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_HOSTNAME}/feed`,
    failureRedirect: `${process.env.CLIENT_HOSTNAME}/login`
  })
);

module.exports = router;