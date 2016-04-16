"use strict";

/**
 * Users collection
**/

var Base = require('widget-cms').Bookshelf;
var User = require('../models/user');


var Users = Base.Collection.extend({

  model: User,


  base: '/admin/users'

});


module.exports = Base.collection('Users', Users);
