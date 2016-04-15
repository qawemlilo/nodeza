"use strict";

/**
 * Module dependencies.
 */


var Base = require('../cms').Bookshelf;
var when  = require('when');


var Token = Base.Model.extend({

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


module.exports = Base.model('Token', Token);
