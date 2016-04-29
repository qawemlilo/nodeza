"use strict";

/**
 * Users collection
**/

const App = require('widget-cms');
const Token = App.getModel('Token');


const Tokens = App.Collection.extend({

  model: Token

});


module.exports = App.addCollection('Tokens', Tokens);
