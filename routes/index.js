// module.exports = function(io) {
  var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cards = require('../models/card');
// var socketApi = require('../socketApi')
var last= [];
var allCards = []
var usersArr = []
var countR = 0;
var currUs = 0;
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}
Cards.find({}, function (err, docs) {
  if (!err) {
    for (var i = 0; i < docs.length; i++) {
      allCards.push(docs[i])
    }
    console.log(allCards)
    shuffle(allCards);
  } 
})


router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('index', { "user": req.user })
  } else {
    res.redirect('/lobby')

  }
});



// socketApi.io.on('connection', function(socket){
//   usersArr.push({id: socket.id})
//   console.log(usersArr)
//   socketApi.io.emit("cos",{"XD":"XXD"})
// });
// socketApi.io.on('ready', function(socket){
//   console.log(countR)
//   if(countR >= 2 && countR == usersArr.length){
//     console.log("Koniec")
//     socketApi.io.emit('gameStart');
//   } else {
//     countR++;
//   }
// });
// socketApi.io.emit('randomCards', {
//   cards: () => {
//     cardFiltered = []
//     for (var i = 0; i < 8; i++) {
//       cardFiltered.push(allCards.splice(i,1)[0])
//     }
//     return JSON.stringify(cardFiltered)
//   }
// });
router.post('/next', function (req, res, next) {
  currUs++;
  if(req.body.used == "hit"){
    for(var c = last.length-1; c < 0; c--){
      if(last[c].value != "changeColor"|| parseInt(last[c].value) ==NaN){
        last.splice(c,1);
        c++;
      }
    }
  }
  if(req.body.used.value) {
    if(req.body.used.value == "turnback")currUs-=2;
  }
  
  last.push(req.body.used);
  res.end();
})
router.post('/addCard', function (req, res, next) {
  res.end(JSON.stringify(allCards.splice(0,1)[0]));
})
router.post('/card', function (req, res, next) {
  res.end(JSON.stringify(allCards.splice(0,1)[0]));
})
router.post('/ready', function (req, res, next) {
    countR++;
    usersArr.push(req.body.nick);
    res.end();
})
router.post('/start', function (req, res, next) {
    if(countR >= 2 && countR == usersArr.length) {
      cardFiltered = []
      for (var i = 0; i < 8; i++) {
        cardFiltered.push(allCards.splice(0,1)[0])
      }
      if(last[0] == undefined) {
        var i = 0;
        while(true){
          if(parseInt(allCards[i].value) != NaN) break;
          i++
        }
        last.push(allCards.splice(i,1)[0])
      }
      res.end(JSON.stringify(['start',cardFiltered]))
    }
    res.end('')
})
router.post('/roundStart', function (req, res, next) {
  res.end(JSON.stringify([usersArr[currUs],last]));
})
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
  // socketio.emit("onconnect", {
  //   clientName:client.id
  // })
//   socketio.on("start", function (data) {
//     console.log(data.user)
//     socketio.sockets.emit("mouseposition", { posX: data.posX, posY:data.posY });
// })
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

// }
