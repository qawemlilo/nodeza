"use strict";

module.exports = function (app, TagsController) {

  app.get('/blog/tags/:slug', TagsController.getPosts); 

};