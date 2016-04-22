"use strict";

/**
 * Users collection
**/

var App = require('widget-cms');
var User = require('../models/user');


var Users = App.Collection.extend({

  model: User,


  base: '/admin/users'

});


module.exports = App.addCollection('Users', Users);
