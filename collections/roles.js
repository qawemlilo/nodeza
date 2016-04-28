"use strict";

/**
 * Users collection
**/

const App = require('widget-cms');
const Role = App.getModel('Role');


const Roles = App.Collection.extend({

  model: Role

});


module.exports = App.addCollection('Roles', Roles);
