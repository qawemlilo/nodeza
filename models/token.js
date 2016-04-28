"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');
const when  = require('when');


const Token = App.Model.extend({

  tableName: 'tokens',


  /*
   * delete post
  **/
  remove: function(id) {
    return Token.forge({id: id})
    .fetch()
    .then(function(model) {
      return model.destroy();
    });
  }


});


module.exports = App.addModel('Token', Token);
