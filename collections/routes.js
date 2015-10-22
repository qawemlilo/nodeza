"use strict";

/**
 * Blog categories collection
**/

var Bookshelf  = require('./base');
var Route = require('../models/route');

var Routes = Bookshelf.Collection.extend({

  model: Route

});

module.exports = Bookshelf.collection('Routes', Routes);
