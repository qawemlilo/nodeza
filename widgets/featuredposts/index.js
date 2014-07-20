
var when = require('when');
var config = require('./config.json');
var cache = false;

module.exports = config;

module.exports.exec = function (req, res, collections) {

	if (cache) {
		return when(cache);
	}

    var posts = new collections.Posts();

    posts.on('add', function () {
      cache = false;
      console.log('new post added');
    });

    posts.whereQuery = ['published_at', '<', new Date()];

    return posts.fetchFeatured(2)
    .then(function (collection) {

      config.collection = collection;

      cache = config;

      return config;
    });
};