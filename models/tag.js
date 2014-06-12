/**
 * Module dependencies.
 */
var Base  = require('./base');
var Posts =  require('../collections/posts');


module.exports =  Base.Model.extend({

  tableName: 'tags',


  hasTimestamps: true,


  posts: function () {
    return this.belongsToMany(Posts);
  }
});
