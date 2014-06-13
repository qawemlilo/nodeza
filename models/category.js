/**
 * Module dependencies.
 */

var Posts  = require('../collections/posts');
var Base  = require('./base');


var Category =  Base.Model.extend({

  tableName: 'categories',


  hasTimestamps: true,


  posts: function () {
    return this.belongsToMany('Posts', 'category_id');
  }
});


module.exports = Base.model('Category', Category);
