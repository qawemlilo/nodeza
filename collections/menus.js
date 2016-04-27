"use strict";

/**
 * Blog categories collection
**/

const App = require('widget-cms');
const Menu = App.getModel('Menu');

let Menus = App.Collection.extend({

  model: Menu

});

module.exports = App.addCollection('Menus', Menus);
