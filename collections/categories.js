"use strict";

/**
 * Blog categories collection
**/

const App = require('widget-cms');
const Category = require('../models/category');


let Categories = App.Collection.extend({

  model: Category

});

module.exports = App.addCollection('Categories', Categories);
