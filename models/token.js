"use strict";

/**
 * Module dependencies.
 */


var App = require('widget-cms');
var when  = require('when');


var Token = App.Model.extend({

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
