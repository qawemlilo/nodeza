"use strict";

module.exports = function (app) {
  app.get('/', function (req, res, next) {
    var opts = {
      title: 'Test',
      description: 'test',
      page: 'home'
    };

    res.render('site/index', opts);
  });
};
