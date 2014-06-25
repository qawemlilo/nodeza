/**
 * Module dependencies.
 */
var Base  = require('./base');
var Posts =  require('../collections/posts');


var Tag =  Base.Model.extend({

  tableName: 'tags',


  hasTimestamps: true,


  posts: function () {
    return this.belongsToMany('Posts');
  }
});


module.exports = Base.model('Tag', Tag);