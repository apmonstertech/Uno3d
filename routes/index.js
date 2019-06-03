var express = require('express');
var router = express.Router();
var User = require('../models/user');
var texture;
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('index', { "user": req.user })
  } else {
    res.redirect('/lobby')
  }
});

router.get('/world', function (req, res, next) {
  if (req.session.page_views) {
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  if (req.isAuthenticated()) {
    res.render('index', { "user": req.user })
  } else {
    res.redirect('/lobby')
  }
});

router.post('/world', function (req, res, next) {
  res.send(texture)

});

router.get('/choice', function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findOne({ username: req.user.username }, function (error, docs) {
      if (docs.texture != "") {
        res.redirect("/world")
      } else {
        res.render('texture', { "user": req.user })
      }
    });

  } else {
    res.redirect('/users/login')
  }
});

router.post('/choice', function (req, res, next) {
  console.log(req.user, req.body.texture)
  texture = req.body.texture
  var query = { username: req.user }
  User.findOne({ username: req.user.username }, function (error, docs) {
    docs.texture = texture
    docs.save()
  });
});

router.get('/world/quest', function (req, res, next) {
  if (req.session.page_views) {
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  res.render('index')

});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login')
}

module.exports = router;
