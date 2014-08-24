"use strict";

/* 
 * Contact Routes
 *
**/


module.exports = function (app, ContactController) {
  app.post('/contact', ContactController.postContact);
};