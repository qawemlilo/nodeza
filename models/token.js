/**
 * Module dependencies.
 */


var Base  = require('./base');
var when  = require('when');


var Token = Base.Model.extend({

  tableName: 'tokens',



  /*
   * delete post
  **/
  remove: function(id) {
    var deferred = when.defer();

    Token.forge({id: id})
    .fetch()
    .then(function(model) {
      var kind = model.get('kind');
      model.destroy()
      .then(function () {
        deferred.resolve(kind + ' account has been unlinked.'); 
      })
      .otherwise(function () {
        deferred.reject('Failed to unlinked ' + kind + ' account.'); 
      });
    })
    .otherwise(function () {
      deferred.reject('Token not found.');
    }); 

    return deferred.promise;
  },

  
});


module.exports = Base.model('Token', Token);
