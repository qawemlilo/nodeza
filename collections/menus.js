"use strict";

/**
 * Blog categories collection
**/

const App = require('widget-cms');
const Menu = App.getModel('Menu');

const Menus = App.Collection.extend({

  model: Menu

});

module.exports = App.addCollection('Menus', Menus);
