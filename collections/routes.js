"use strict";

/**
 * Blog categories collection
**/

var Bookshelf = require('../cms').Bookshelf;
var Route = require('../models/route');

var Routes = Bookshelf.Collection.extend({

  model: Route

});

module.exports = Bookshelf.collection('Routes', Routes);
