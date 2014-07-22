/**
 *  Database connection.
 */


var secrets = require('./config/secrets');
var db = require('./config/db');


/*
  Bookshelf initialization
*/
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: secrets.host,
    user: secrets.user,
    password: secrets.password,
    database: secrets.db,
    charset: secrets.charset
  }
});


var Bookshelf = require('bookshelf')(knex);

/*
 * This solves the circular dependency problem created by Bookshelf models
 * in a previous commit #38d98bb4c33e91b636a3538bd546ebe7f5077328
 *
**/
Bookshelf.plugin('registry');

db.Bookshelf = Bookshelf;



var mongoose = require('mongoose');
var express = require('express');
var flash = require('express-flash');
var logger = require('morgan');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('lusca').csrf();
var errorHandler = require('errorhandler');
var widget = require('./lib/widget');
var expressValidator = require('express-validator');
var hbs = require('hbs');
var path = require('path');
var passport = require('passport');
var _ = require('lodash');
var routes = require('./routes');
var hbsHelpers = require('./helpers');
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
var hour = (1000 * 60 * 60);
var day = hour * 24;
var week = day * 7;

var csrfWhitelist = [
  '/this-url-will-bypass-csrf'
];


//app.set('Bookshelf', Bookshelf);

// port
app.set('port', process.env.PORT || 3000);

// define views folder  
app.set('views', path.join(__dirname, 'views'));


/*
 * Handlebars settings
**/
app.set('view engine', 'hbs');
app.engine('hbs', hbs.__express);

hbs.localsAsTemplateData(app);
hbs.registerPartials(path.join(__dirname,'views', 'widgets'));
hbs.registerPartials(path.join(__dirname,'views', 'partials'));
hbs.registerPartials(path.join(__dirname,'views', 'account'));
hbs.registerPartials(path.join(__dirname,'views', 'events'));
hbs.registerPartials(path.join(__dirname,'views', 'meetups'));
hbs.registerPartials(path.join(__dirname,'views', 'posts'));

// setup and register handlebars helpers
hbsHelpers.setup(hbs);


// parse cookies
app.use(cookieParser());

// session management
app.use(session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.mongodb,
    auto_reconnect: true
  })
}));

// login management
app.use(passport.initialize());
app.use(passport.session());

// handle image uploads
app.use(multer({
  dest: './public/img/blog/',
  rename: function (fieldname, filename) {
    return 'image_' + Date.now();
  }
}));

// for forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// input validation
app.use(expressValidator());

// message display
app.use(flash());

// serve static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));


// logging
app.use(logger('dev'));

// security
app.use(function(req, res, next) {
  csrf(req, res, next);
});

// make user object available in templates
app.use(function(req, res, next) {
  if (req.user) {
    res.locals.user = req.user.toJSON();
    req.session.user = res.locals.user;
  }

  res.locals.base = 'http://localhost:' + app.get('port');

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

// error handling
app.use(errorHandler());

// Load widgets
app.use(widget());

// pass the app object to routes
routes.setup(app);



/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});


module.exports = app;
