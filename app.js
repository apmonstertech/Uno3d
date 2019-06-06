require('./db/db')
var createError = require('http-errors');
var express = require('express');
// var socket_io = require("socket.io");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser")
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var hbs = require("express-handlebars")
var flash = require("express-flash-messages");
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
// var http = require('http').createServer(app);
// var socketio = require('socket.io')(http);
// var io = socket_io();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lobbyRouter = require('./routes/lobby');

var app = express();

// app.io = io;


// view engine setup

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, '/views/'))
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs', extname: '.hbs',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs')
// hbs.localsAsTemplateData(app);

//Handle File uploads
// app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

var hour = 3600000;
//Handle Sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false,
  name: 'gus',
  cookie: {
    // maxAge: hour*60
  }
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require('connect-flash')());
//Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));


app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lobby', lobbyRouter);

app.get('*', function (req, res, next) {
  res.locals.user = req.user.username
  next()
})

// exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     app.locals.name = req.user.username || null
//     return next()
//   }
//   res.redirect('/')
// }

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
