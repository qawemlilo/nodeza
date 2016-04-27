"use strict";

/**
 * Blog categories collection
**/

const App = require('widget-cms');
const Category = App.getModel('Category');


let Categories = App.Collection.extend({

  model: Category

});

module.exports = App.addCollection('Categories', Categories);
