var express = require('express');
var router = express.Router();


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
  console.log(req.body)
  res.send(req.body.texture)
});


router.get('/choice', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('texture', { "user": req.user })
  } else {
    res.redirect('/users/login')
  }
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
