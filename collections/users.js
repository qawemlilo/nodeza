/**
 * Users collection
**/

var Base  = require('./base');
var User = require('../models/user');


var Users = Base.Collection.extend({

  model: User,
  

  base: '/account/users'

});


module.exports = Base.collection('Users', Users);