"use strict";

/**
 * Users collection
**/

var App = require('widget-cms');
var Role = require('../models/roles');


var Roles = App.Collection.extend({

  model: Role

});


module.exports = App.addCollection('Roles', Roles);
