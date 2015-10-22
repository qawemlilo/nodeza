

var Bookshelf = null;
var config = require('../config');

function loadBookshelf() {
  "use strict";

  if (Bookshelf) {
  	return Bookshelf;
  }


  var knex = require('knex')({
    client: 'mysql',
    connection: config.mysql
  });

  Bookshelf = require('bookshelf')(knex);

  /*
   * This solves the circular module dependency problem created by Bookshelf models
   * in a previous commit #38d98bb4c33e91b636a3538bd546ebe7f5077328
  **/
  Bookshelf.plugin('registry');


  return Bookshelf;
}

module.exports = loadBookshelf();
