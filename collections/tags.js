"use strict";

/**
 * Blog tags collection
**/

const App = require('widget-cms');
const Tag = App.getModel('Tag');



let Tags = App.Collection.extend({

  model: Tag,


  limit: 5,


  /**
   * Fetches featured front page posts
  */
  fetchTags: function (limit, options) {

    let tags = Tags.forge();

    return tags.query((query) => {
      query.limit(limit || this.limit);
    })
    .fetch(options || {})
    .then(function (collection) {
      return collection;
    });
  }

});


module.exports = App.addCollection('Tags', Tags);
