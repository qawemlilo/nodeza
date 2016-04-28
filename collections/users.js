"use strict";

/**
 * Users collection
**/

const App = require('widget-cms');
const User = App.getModel('User');


const Users = App.Collection.extend({

  model: User,


  base: '/admin/users'

});


module.exports = App.addCollection('Users', Users);
