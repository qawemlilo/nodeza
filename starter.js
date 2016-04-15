
"use strict";

/*
 *  Application point of entry
**/

var config = require('./config');

config.rootDir = config.appDir = process.cwd();

var app = require('./cms/app');

app.init(config);
