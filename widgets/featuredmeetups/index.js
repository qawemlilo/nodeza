
var when = require('when');
var config = require('./config.json');


config.exec = function (App) {

  if (App.cacheExists('featuredmeetups')) {
    return when(App.getCache('featuredmeetups'));
  }


  var meetups = App.getCollection('Meetups');

  return meetups.fetchBy('id', {
    limit: 2,
    noPagination: true,
    where: ['created_at', '<', new Date()]
  },{
    columns: ['title', 'short_desc', 'slug', 'image_url']
  })
  .then(function (collection) {
    config.collection = collection;

    App.setCache('featuredmeetups', config);

    return config;
  });
};


module.exports = config;