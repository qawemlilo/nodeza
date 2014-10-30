"use strict";

/**
 * Blog tags collection
**/

var Base  = require('./base');
var Tag = require('../models/tag');



var Tags = Base.Collection.extend({

  model: Tag,


  limit: 5,

  
  /**
   * Fetches featured front page posts
  */
  fetchTags: function (limit, options) {
    
    var self = this;
    var tags = Tags.forge();
    
    return tags.query(function (query) {
      query.limit(limit || self.limit);
    })
    .fetch(options || {})
    .then(function (collection) {
      return collection;
    });
  }

});


module.exports = Base.collection('Tags', Tags);
