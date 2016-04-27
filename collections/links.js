"use strict";

/**
 * Blog categories collection
**/

const App = require('widget-cms');
const LinkModel = App.getModel('Link');

let Links = App.Collection.extend({

  model: LinkModel

});

module.exports = App.addCollection('Links', Links);
