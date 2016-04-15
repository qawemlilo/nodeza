"use strict";


module.exports = function (config) {
  let express = require('express');
  let flash = require('express-flash');
  let logger = require('morgan');
  let multer = require('multer');
  let cookieParser = require('cookie-parser');
  let bodyParser = require('body-parser');
  let session = require('express-session');
  let errorHandler = require('errorhandler');
  let expressValidator = require('express-validator');
  let hbs = require('hbs');
  let path = require('path');
  let passport = require('passport');
  let _ = require('lodash');
  let hbsHelpers = require('./lib/helpers');
  let middleware = require('./lib/middleware');
  let MongoStore = require('connect-mongo')({session: session});


  /**
   * Create Express server.
   */
  let server = express();

  /**
   * Express configuration.
   */
  let day = (1000 * 60 * 60) * 24;
  let maxAge = day * config.site.maxAge;

  let csrfWhitelist = config.site.csrfWhitelist;


  // server port
  server.set('port', process.env.PORT || config.site.port);

  //server.set('ipAddress', process.env.PORT || config.site.ipAddress);

  // define views folder
  server.set('views', path.join(config.rootDir, 'views'));

  /*
   * Handlebars settings
  **/
  server.set('view engine', 'hbs');
  server.engine('hbs', hbs.__express);
  server.disable('view cache');
  server.disable('x-powered-by');

  hbs.localsAsTemplateData(server);
  hbs.registerPartials(path.join(config.rootDir,'views', 'partials'));

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
  server.use(express.static(path.join(config.rootDir, 'public'), { maxAge: maxAge }));

  // handle image uploads
  server.use(multer({
    dest: config.rootDir + '/public/temp/',
    rename: function (fieldname, filename) {
      return 'image_' + Date.now();
    }
  }));

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
