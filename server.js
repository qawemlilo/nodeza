
module.exports = function (config) {
  "use strict"; 
  
  var express = require('express');
  var flash = require('express-flash');
  var logger = require('morgan');
  var multer = require('multer');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var csrf = require('lusca').csrf();
  var errorHandler = require('errorhandler');
  var expressValidator = require('express-validator');
  var hbs = require('hbs');
  var path = require('path');
  var passport = require('passport');
  var _ = require('lodash');
  var hbsHelpers = require('./lib/helpers');
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
  
  // port
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
      auto_reconnect: true
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
  }));
  
  // login management
  server.use(passport.initialize());
  server.use(passport.session());
  
  // handle image uploads
  server.use(multer({
    dest: './public/temp/',
    rename: function (fieldname, filename) {
      return 'image_' + Date.now();
    }
  }));
  
  // for forms
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded());
  
  // input validation
  server.use(expressValidator());
  
  // message display
  server.use(flash());
  
  // serve static files
  server.use(express.static(path.join(__dirname, 'public'), { maxAge: maxAge }));
  
  
  // logging
  server.use(logger('dev'));
  
  // CSRF protection.
  /*
  server.use(function(req, res, next) {
    if (_.contains(csrfWhitelist, req.path)) {
      return next();
    }
    
    csrf(req, res, next);
  });*/
  

  server.use(function(req, res, next) {
    if (req.user) {
      // make user object available in templates
      res.locals.user = req.user.toJSON();
      req.session.userid = req.user.get('id');
    }

    res.locals.sessionHistory = req.session.history;
    res.locals.base = 'http://' + req.headers.host;
    res.locals._csrf = '';
  
    next();
  });
  
  server.use(function(req, res, next) {
    // Keep track of previous URL to redirect back to
    // original destination after a successful login.
    if (req.method !== 'GET') {
      return next();
    }

    var path = req.path.split('/')[1];

    if (/(auth|login|logout|signup)$/i.test(path)) {
      return next();
    }

    req.session.returnTo = req.path;
    
    next();
  });
  
  // error handling
  server.use(errorHandler());

  return server;
};




