

var Bookshelf = null;

module.exports = function (config) {

  if (Bookshelf) {
  	return Bookshelf;
  }

  var mongoose = require('mongoose');

  mongoose.connect(config.mongodb.url);
  mongoose.connection.on('error', function() {
    console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
  });


  var knex = require('knex')({
    client: config.mysql.client,
    connection: {
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.db,
      charset: config.mysql.charset
    }
  });

  Bookshelf = require('bookshelf')(knex);
  
  /*
   * This solves the circular module dependency problem created by Bookshelf models
   * in a previous commit #38d98bb4c33e91b636a3538bd546ebe7f5077328
  **/
  Bookshelf.plugin('registry');


  return Bookshelf;
};
