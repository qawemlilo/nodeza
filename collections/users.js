"use strict";

/**
 * Users collection
**/

const App = require('widget-cms');
const User = App.getModel('User');


let Users = App.Collection.extend({

  model: User,


  base: '/admin/users'

});


module.exports = App.addCollection('Users', Users);
