/**
 * Module dependencies.
**/
var Bookshelf  = require('../config/db').Bookshelf;
var Tag = require('../models/tag');
var when = require('when');



var Tags = Bookshelf.Collection.extend({

  model: Tag,


  limit: 5,

  
  /**
   * Fetches featured front page posts
  */
  fetchTags: function (limit, options) {
    
    var self = this;
    var deferred = when.defer();
    var tags = Tags.forge();
    
    tags.query(function (query) {
      query.limit(limit || self.limit);
    })
    .fetch(options || {})
    .then(function (collection) {
      deferred.resolve(collection);
    })
    .otherwise(function () {
      deferred.reject();
    });

    return deferred.promise;
  }

});


module.exports = Bookshelf.collection('Tags', Tags);
