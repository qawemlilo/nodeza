
"use strict";

const App = require('widget-cms');
const redis = require('redis');
const Queue = redis.createClient();


async function sendMessage(from, to, message, host) {
  try {
    let Conversation = App.getModel('Conversation');
    let Message = App.getModel('Message');

    let conversation;

    if (to.get('id') === from.get('id')) {
      return false;
    }

    conversation = await Conversation.forge().query(function(query) {
      query.where(function(qb) {
        qb.where('from_id', '=', from.get('id')).andWhere('to_id', '=', to.get('id'));
      })
      .orWhere(function(qb) {
        qb.where('to_id', '=', from.get('id')).andWhere('from_id', '=', to.get('id'));
      });
    })
    .fetch();

    if (!conversation) {
      conversation = await Conversation.forge({from_id: from.get('id'), to_id: to.get('id')}).save();
    }


    let newMessage = await Message.forge({
      conversation_id: conversation.get('id'),
      from_id: from.get('id'),
      to_id: to.get('id'),
      body: message
    })
    .save();

    if (to.get('subscribed')) {
      Queue.publish('email', JSON.stringify({
        type: 'message',
        from: from.toJSON(),
        message: newMessage.get('body'),
        to: to.toJSON(),
        conversation_id: conversation.get('id')
      }));
    }


    conversation = await conversation.save({updated_at: new Date()});

    return sentMessage;
  }
  catch (e) {
    console.error(e);
    return res.redirect('back');
  }
}


const MessagesController = App.Controller.extend({

  /**
   * GET /admin/messages
   * Delete user account.
  */
  getConversations: async function(req, res, next) {
    let Conversation = App.getModel('Conversation');

    try {
      let conversations = await Conversation.forge()
      .query(function(qb) {
        qb.where('from_id', '=', req.user.get('id'))
        .orWhere('to_id', '=', req.user.get('id'));
      })
      .orderBy('updated_at', 'desc')
      .fetchPage({
         pageSize: 10,
         page: req.query.p || 1,
         withRelated: [
           'from',
           'to',
           {
             messages: function(query) {
               return query.orderBy('created_at','desc');
             }
           }
         ]
      });

      let pagination = conversations.pagination;

      pagination.base = `http://${req.headers.host}/admin/messages`;

      res.render('users/messages', {
        title: 'Mesaages',
        conversations: conversations.toJSON(),
        pagination: pagination,
        description: 'Mesaages',
        page: 'messages',
        query: {}
      });
    }
    catch (e) {
      console.error(e.stack)
      return res.redirect('back');
    }

  },


  postMessage: async function(req, res, next) {
    req.assert('to', 'You should be logged in to send messages.').isInt();
    req.assert('message', 'Message must be at least 12 characters long').len(2);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let User = App.getModel('User');
      let Conversation = App.getModel('Conversation');
      let Message = App.getModel('Message');

      let from = req.user;
      let to = await User.where({id: req.body.to}).fetch();
      let conversation;

      if (to.get('id') === from.get('id')) {
        return res.redirect('back');
      }

      if (req.body.conversation_id) {
        conversation = await Conversation.where({id: req.body.conversation_id}).fetch();
      }
      else {
        conversation = await Conversation.forge().query(function(query) {
          query.where(function(qb) {
            qb.where('from_id', '=', from.get('id')).andWhere('to_id', '=', to.get('id'));
          })
          .orWhere(function(qb) {
            qb.where('to_id', '=', from.get('id')).andWhere('from_id', '=', to.get('id'));
          });
        })
        .fetch();
      }

      if (!conversation) {
        conversation = await Conversation.forge({from_id: from.get('id'), to_id: to.get('id')}).save();
      }


      let newMessage = await Message.forge({
        conversation_id: conversation.get('id'),
        from_id: from.get('id'),
        to_id: to.get('id'),
        body: req.body.message
      })
      .save();

      if (to.get('subscribed')) {
        Queue.publish('email', JSON.stringify({
          type: 'message',
          from: from.toJSON(),
          to: to.toJSON(),
          message: newMessage.get('body'),
          conversation_id: conversation.get('id')
        }));
      }

      await conversation.save({updated_at: new Date()});

      if (req.body.conversation_id) {
        return res.redirect('back');
      }
      else {
        return res.redirect('/admin/messages');
      }
    }
    catch (e) {
      console.error(e);
      return res.redirect('back');
    }
  },


  /**
   * GET /users/delete/:id
   * Delete user account.
  */
  getConversation: async function(req, res, next) {
    let Messages = App.getCollection('Messages');
    let Conversation = App.getModel('Conversation');

    try {
      let messages = await Messages.forge()
      .query('where', 'conversation_id', '=', req.params.id)
      .fetch({
         withRelated: [
           'from',
           'to'
         ] // Passed to Model#fetchAll
      });

      let conversation = await Conversation.forge({id: req.params.id}).fetch();

      await conversation.markAsRead(req.user.get('id'));

      res.render('users/message', {
        title: 'Messages',
        messages: messages.toJSON(),
        description: 'messages',
        page: 'messages',
        query: {},
        conversation: conversation.toJSON()
      });
    }
    catch (e) {
      console.error(e.stack)
      return res.redirect('back');
    }

  },


  postMessageToAll: async function(req, res, next) {
    req.assert('message', 'Message must be at least 12 characters long').len(2);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    try {
      let Users = App.getCollection('Users');
      let Conversation = App.getModel('Conversation');
      let Message = App.getModel('Message');

      let from = req.user;
      let allusers = await Users.forge().query('where', 'id', '!=', from.get('id')).fetch();

      allusers.each(function (user) {
        let sentmessage = sendMessage(req.user, user, req.body.message, req.headers.host);
      });

      return res.redirect('back');
    }
    catch (e) {
      console.error(e);
      return res.redirect('back');
    }
  }
});


module.exports = App.addController('Messages', MessagesController);
