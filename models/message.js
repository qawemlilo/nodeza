"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');
const markdown = require('markdown-it')();


const Message = App.Model.extend({

  tableName: 'messages',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    let html = markdown.render(this.get('body'));

    html = html.replace(/&amp;/gi, '&');

    this.set('html', html);
  },


  from: function () {
    return this.belongsTo('User', 'from_id');
  },


  to: function () {
    return this.belongsTo('User', 'to_id');
  },


  /*
   * delete message
  **/
  delete: function(id) {
    return Message.forge({id: id})
    .fetch()
    .then(function (post) {
      return post.destroy();
    });
  },


  markAsRead: function () {
    return this.save({'read': 1});
  },


  conversation: function () {
    return this.belongsTo('Conversation');
  },

});

module.exports = App.addModel('Message', Message);
