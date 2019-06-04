var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cards = require('../models/card');
var allCards = []

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
    res.render('index')

    //res.redirect('/lobby')
  }
});

router.post('/world', function (req, res, next) {
  Cards.find({}, function (err, docs) {
    if (!err) {
      var cards = []
      cardFiltered = []
      for (var i = 0; i < 8; i++) {
        cardFiltered.push(docs[Math.floor(Math.random() * docs.length)])
        allCards.push()
      }
      console.log(cardFiltered)
      res.send(JSON.stringify(cardFiltered))
    } else { throw err; }
  });
});

// router.get('/choice', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     User.findOne({ username: req.user.username }, function (error, docs) {
//       if (docs.texture != "") {
//         res.redirect("/world")
//       } else {
//         res.render('texture', { "user": req.user })
//       }
//     });

//   } else {
//     res.redirect('/users/login')
//   }
// });

// router.post('/choice', function (req, res, next) {
//   console.log(req.user, req.body.texture)
//   texture = req.body.texture
//   var query = { username: req.user }
//   User.findOne({ username: req.user.username }, function (error, docs) {
//     docs.texture = texture
//     docs.save()
//   });
// });

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
