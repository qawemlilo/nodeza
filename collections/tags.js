"use strict";

/**
 * Blog tags collection
**/

var Base  = require('./base');
var Tag = require('../models/tag');
var when = require('when');



var Tags = Base.Collection.extend({

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
    .otherwise(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

});


module.exports = Base.collection('Tags', Tags);
