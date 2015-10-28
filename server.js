
module.exports = function (config) {
  "use strict";

  var express = require('express');
  var flash = require('express-flash');
  var logger = require('morgan');
  var multer = require('multer');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var errorHandler = require('errorhandler');
  var expressValidator = require('express-validator');
  var hbs = require('hbs');
  var path = require('path');
  var passport = require('passport');
  var _ = require('lodash');
  var hbsHelpers = require('./lib/helpers');
  var middleware = require('./lib/middleware');
  var MongoStore = require('connect-mongo')({session: session});


  /**
   * Create Express server.
   */
  var server = express();

  /**
   * Express configuration.
   */
  var day = (1000 * 60 * 60) * 24;
  var maxAge = day * config.site.maxAge;

  var csrfWhitelist = config.site.csrfWhitelist;


  // server port
  server.set('port', process.env.PORT || config.site.port);

  //server.set('ipAddress', process.env.PORT || config.site.ipAddress);

  // define views folder
  server.set('views', path.join(__dirname, 'views'));

  /*
   * Handlebars settings
  **/
  server.set('view engine', 'hbs');
  server.engine('hbs', hbs.__express);
  server.disable('view cache');

  hbs.localsAsTemplateData(server);
  hbs.registerPartials(path.join(__dirname,'views', 'partials'));

  // setup and register handlebars helpers
  hbsHelpers.setup(hbs);


  // parse cookies
  server.use(cookieParser());

  // session management
  server.use(session({
    secret: config.site.sessionSecret,
    store: new MongoStore({
      url: config.mongodb.url,
      autoReconnect: true
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
  }));

  // login management
  server.use(passport.initialize());
  server.use(passport.session());

  // for forms
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  // input validation
  server.use(expressValidator());

  // message display
  server.use(flash());

  // serve static files
  server.use(express.static(path.join(__dirname, 'public'), { maxAge: maxAge }));

  // handle image uploads
  server.use(multer({
    dest: './public/temp/'
  }).single('image_' + Date.now()));

  // logging
  server.use(logger('dev'));

  // CSRF protection.
  server.use(middleware.csrf({whitelist: config.site.csrfWhitelist}));


  server.use(middleware.sessionHistory());

  server.use(middleware.returnTo());

  // error handling
  server.use(errorHandler());

  return server;
};




