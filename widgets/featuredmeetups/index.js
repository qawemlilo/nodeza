

var config = require('./config.json');


module.exports.config = config;

module.exports.exec = function (App) {

  var meetups = App.getCollection('Meetups');

  return meetups.fetchBy('id', {
    limit: 2,
    noPagination: true,
    order: 'asc',
    where: ['created_at', '<', new Date()]
  },{
    columns: ['title', 'short_desc', 'slug', 'image_url']
  })
  .then(function (collection) {

    return collection;
  });
};
