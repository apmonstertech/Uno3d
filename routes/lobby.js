var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('lobby', { "user": req.user })
    } else {
        res.render('lobby')
    }

});

module.exports = router;