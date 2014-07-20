/**
 * Module dependencies.
 */
var Base  = require('./base');
var Posts =  require('../models/post');


var Tag =  Base.Model.extend({

  tableName: 'tags',


  hasTimestamps: true,


  posts: function () {
    return this.belongsToMany('Post');
  }
});


module.exports = Base.model('Tag', Tag);
