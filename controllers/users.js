
"use strict";

const App = require('widget-cms');
const mailGun = require('../lib/mailgun');


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

    let mailOptions = {
      to: to.get('email'),
      subject: `${from.get('name')} has sent you a message on NodeZA`,
      body: `Hi there ${to.get('name')}, <br><br>` +
        `You have a new message from ${from.get('name')} on NodeZA. Please follow the link below to read your message.<br><br>` +
        `<a href="https://${host}/admin/messages/${conversation.get('id')}">View your message</a>`
    };

    let sentMessage = await mailGun.sendEmail(mailOptions);

    return sentMessage;
  }
  catch (e) {
    console.error(e);
    return res.redirect('back');
  }
}


const UsersController = App.Controller.extend({

  /*
   * GET /devs/:id
   * loads an event by id
   */
  getProfile: function (req, res, next) {
    let profile;
    let User = App.getModel('User');
    let twitter = App.getPlugin('twitter');

    User.forge({slug: req.params.slug})
    .fetch({withRelated: ['posts', 'events']})
    .then(function (user) {
      profile = user;

      if (user.twitterHandle()) {
        return twitter.getTweets(user.twitterHandle());
      }
      else {
        return false;
      }
    })
    .then(function (tweets) {

      res.render('users/profile', {
        title: 'NodeZA profile of ' + profile.get('name'),
        myposts: profile.related('posts').toJSON(),
        myevents: profile.related('events').toJSON(),
        description: 'NodeZA profile of ' + profile.get('name'),
        profile: profile.toJSON(),
        page: 'profile',
        tweets: tweets || []
      });

      return profile.viewed();
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },


  /*
   * GET /admin/users/new
   * Load new user form
  **/
  getNewUser: function (req, res, next) {
    res.render('users/new', {
      title: 'New User',
      description: 'New User',
      page: 'newuser'
    });
  },


  /*
   * GET /users/edit/:id
   * Load user edit form
  **/
  getEditUser: function (req, res, next) {
    let roles;
    let Roles = App.getCollection('Roles');
    let User = App.getModel('User');

    Roles.forge()
    .fetch()
    .then(function (collection) {
      roles = collection;

      return User.forge({id: req.params.id}).fetch({withRelated: ['role']});
    })
    .then(function (user) {
      res.render('users/edit', {
        title: 'Edit User',
        description: 'Edit User',
        usr: user.toJSON(),
        roles: roles.toJSON(),
        page: 'edituser'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/admin/users');
    });
  },



  /**
   * GET /devs
   * get all users
   */
  getDevs: function (req, res) {
    let Users = App.getCollection('Users');
    let users = new Users();
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let opts = {
      limit: 5,
      page: currentpage,
      order: "asc"
    };

    users.base = '/devs';

    users.fetchBy('id', opts, {withRelated: ['role']})
    .then(function (collection) {
      res.render('users/devs', {
        title: 'Developers',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Developers',
        page: 'devs',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },




  /**
   * GET /admin/users
   * get all users
   */
  getUsers: function (req, res) {
    let Users = App.getCollection('Users');
    let users = new Users();
    let page = parseInt(req.query.p, 10);
    let currentpage = page || 1;
    let opts = {
      limit: 10,
      page: currentpage,
      order: "asc"
    };

    users.fetchBy('id', opts, {withRelated: ['role']})
    .then(function (collection) {
      res.render('users/users', {
        title: 'Registered Users',
        pagination: users.pages,
        users: collection.toJSON(),
        description: 'Registered Users',
        page: 'users',
        query: {}
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      res.redirect('/');
    });
  },


  /**
   * POST /users/new
  **/
  postUser: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let User = App.getModel('User');
    let details = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role_id: 1
    };

    User.forge(details)
    .save()
    .then(function (user) {
      req.flash('success', {msg: 'User account created'});
      res.redirect('/admin/users');
    })
    .catch(function (error) {
      req.flash('errors', {msg: error.message});
      next(error);
    });
  },


  /**
   * POST /users/edit
  **/
  postEditUser: function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('name', 'Name must be at least 3 characters long').len(3);

    let errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    let User = App.getModel('User');
    let details = {
      name: req.body.name,
      email: req.body.email,
      github_url: req.body.github_url,
      twitter_url: req.body.twitter_url,
      role_id: req.body.role_id
    };

    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', {msg: 'Passwords should match'});
        return res.redirect('back');
      }

      details.password = req.body.password;
    }

    User.forge({id: req.body.id})
    .fetch()
    .then(function (user) {
      return user.save(details);
    })
    .then(function(model) {
      req.flash('success', {msg: 'User information updated.'});
      res.redirect('/users/edit/' + model.get('id'));
    })
    .catch(function (error) {
      req.flash('error', {msg: error.message});
      next(error);
    });
  },


  /**
   * GET /users/delete/:id
   * Delete user account.
  */
  getDeleteUser: function(req, res, next) {
    let User = App.getModel('User');
    let user = new User();

    user.deleteAccount(req.params.id)
    .then(function (msg) {
      req.flash('success', {msg: 'User successfully deleted.'});
      res.redirect('back');
    })
    .catch(function (error) {
      console.log(error.stack);
      req.flash('error', { msg: error.message });
      next(error);
    });
  },


  /**
   * GET /users/delete/:id
   * Delete user account.
  */
  getConversations: async function(req, res, next) {
    let Conversations = App.getCollection('Conversations');

    try {
      let conversations = await Conversations.forge()
      .fetchBy('id', {
        page: 1,
        limit: 10,
        where: ['from_id', '=', req.user.get('id')],
        orWhere: ['to_id', '=', req.user.get('id')]
      },
      {
        withRelated: [
          'from',
          'to',
          { messages: function(query) { query.orderBy('created_at','desc'); }}
        ]
      });

      res.render('users/messages', {
        title: 'Mesaages',
        conversations: conversations.toJSON(),
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

  postContact: async function(req, res, next) {
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

      let mailOptions = {
        to: to.get('email'),
        subject: `${from.get('name')} has sent you a message on NodeZA`,
        body: `Hi there ${to.get('name')}, <br><br>` +
          `You have a new message from ${from.get('name')} on NodeZA. Please follow the link below to read your message.<br><br>` +
          `<a href="https://${req.headers.host}/admin/messages/${conversation.get('id')}">View your message</a>`
      };

      let sentMessage = await mailGun.sendEmail(mailOptions);

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

  postContactToAll: async function(req, res, next) {
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


module.exports = App.addController('Users', UsersController);
