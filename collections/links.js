"use strict";

/**
 * Blog categories collection
**/

var Bookshelf = require('../cms').Bookshelf;
var LinkModel = require('../models/link');

var Links = Bookshelf.Collection.extend({

  model: LinkModel

});

module.exports = Bookshelf.collection('Links', Links);
