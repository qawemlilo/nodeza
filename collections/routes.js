/**
 * Blog categories collection
**/

var Bookshelf  = require('../app').bookshelf;
var Route = require('../models/route');

var Routes = Bookshelf.Collection.extend({

  model: Route

});

module.exports = Bookshelf.collection('Routes', Routes);
