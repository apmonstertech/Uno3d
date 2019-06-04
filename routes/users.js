var express = require('express');
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: "Register Page" })
});

router.get('/login', function (req, res, next) {
  const flashMessages = res.locals.getMessages()
  if (flashMessages.error) {
    res.render('login', {
      showErrors: true,
      errors: flashMessages.error
    });
  }
  else {
    res.render('login');
  }
});

router.post('/login',
  passport.authenticate('local',
    { failureRedirect: '/users/login', failureFlash: true }),
  function (req, res) {
    res.redirect('/world')

  });

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Unknow User' })
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw done(err);
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Invalid Password' })
      }
    })
  })

}))



router.post('/register', function (req, res, next) {
  console.log(req.body)
  var username = req.body.username;
  var password = req.body.password;

  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('username', 'Username exists').exists()
  req.checkBody('username').isLength({ min: 3 }).withMessage("Too short message, min 3 characters")
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('passwordAgain', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', { errors: errors })
  } else {
    var newUser = new User({
      username: username,
      password: password,
      items: {
        numOne: "",
        numTwo: "",
        numThree: "",
        numFour: "",
        numFive: "",
        numSix: "",
        numSeven: "",
        numEight: "",
        numNine: "",
      },
      texture: ""
    })

    User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (user) {
        console.log("USER EXISTS")
      } else {
        User.createUser(newUser, function (err, user) {
          if (err) throw err;
        });
        req.flash('succes', 'You are now registered and can logged')
        //res.location('/world')
        res.redirect('/users/login')
      }
    });
  }
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/')
})

router.get('/profile', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('profile', { "user": req.user })
  } else {
    res.redirect('/users/login')
  }
})

module.exports = router;
