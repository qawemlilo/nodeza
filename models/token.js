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
      .otherwise(function (error) {
        deferred.reject(error); 
      });
    })
    .otherwise(function (error) {
      deferred.reject(error);
    }); 

    return deferred.promise;
  },

  
});


module.exports = Base.model('Token', Token);
