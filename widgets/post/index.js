
var config = require('./config.json');
var when = require('when');

module.exports = config;

module.exports.exec = function (collections, req) {
    if (!req) {
      return when(config);
    }
    
    var Posts = new collections.Posts();
    var Post = Posts.model;
    var url = req.path;
    var slug = url.substring(url.lastIndexOf('/')).replace('/', '');
    var title = '';
    var description = ''

    return Post.forge({slug: slug})
    .fetch({withRelated: ['created_by', 'tags']})
    .then(function (post) {
      
      if (post) {
        title = post.get('meta_title');
        description = post.get('meta_description');
      }

      config.globals = {
        title: title,
        description: description 
      };

      config.model = post;

      return config;
    });
};