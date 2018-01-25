"use strict";

/**
 * Module dependencies.
 */


const App = require('widget-cms');


const Conversation = App.Model.extend({

  tableName: 'conversations',


  hasTimestamps: true,


  from: function () {
    return this.belongsTo('User', 'from_id');
  },


  to: function () {
    return this.belongsTo('User', 'to_id');
  },


  messages: function () {
    return this.hasMany('Message');
  },


  markAsRead: function (to_id) {
    let Message = App.getModel('Message');

    return Message.where({'read': false, conversation_id: this.id, to_id: to_id})
    .query() // Get Knex instance related to model
    .update('read', true);
  },


  unreadmessages: function () {
    return this.hasMany('Message').query('where', 'read', '=', 0);
  }

});

module.exports = App.addModel('Conversation', Conversation);
