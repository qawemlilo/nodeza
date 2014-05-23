/**
 *  Database connection.
 */



var Bookshelf  = require('bookshelf');
var secrets = require('./config/secrets');


/*
  Bookshelf initialization
*/
Bookshelf.PG = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: secrets.host,
    user: secrets.user,
    password: secrets.password,
    database: secrets.db,
    charset: secrets.charset
  }
});



var mongoose = require('mongoose');
var express = require('express');
var flash = require('express-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('lusca').csrf();
var errorHandler = require('errorhandler');
var expressValidator = require('express-validator');
var path = require('path');
var passport = require('passport');
var _ = require('underscore');
var routes = require('./routes');
var MongoStore = require('connect-mongo')({ session: session });


/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.mongodb);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});



/**
 * Create Express server.
 */

var app = express();


/**
 * Express configuration.
 */

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

var csrfWhitelist = [
  '/this-url-will-bypass-csrf'
];

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.mongodb,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(logger('dev'));
app.use(function(req, res, next) {
  csrf(req, res, next);
});

app.use(function(req, res, next) {
  res.locals.user = req.user;
  req.session.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Keep track of previous URL to redirect back to
  // original destination after a successful login.
  if (req.method !== 'GET') return next();
  var path = req.path.split('/')[1];
  if (/(auth|login|logout|signup)$/i.test(path)) return next();
  req.session.returnTo = req.path;
  next();
});


app.use(errorHandler());


routes.setup(app);


/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});


module.exports = app;
module.exports.PG = Bookshelf.PG;
