/**
 * Module dependencies.
 */
var Base  = require('./base');
var Posts  = require('../collections/posts');


module.exports =  Base.Model.extend({

  tableName: 'categories',


  hasTimestamps: true,


  posts: function () {
    return this.belongsToMany(Posts, 'category_id');
  }
});
