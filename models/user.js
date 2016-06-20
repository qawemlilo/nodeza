"use strict";

/**
 * Module dependencies.
**/
const App = require('widget-cms');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const when = require('when');
const node = require('when/node');
const _ = require('lodash');


const User = App.Model.extend({

  tableName: 'users',


  initialize: function () {

    App.Model.prototype.initialize.apply(this, arguments);

    this.on('saved', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });

    this.on('updated', (model, attributes, options) => {
      if (App.getConfig('cache')) {
        App.clearCache();
      }
    });
  },


  hasTimestamps: true,


  tokens: function() {
    return this.hasMany('Token');
  },


  role: function() {
    return this.belongsTo('Role');
  },


  events: function() {
    return this.hasMany('Events');
  },


  posts: function() {
    return this.hasMany('Posts');
  },



  generatePasswordHash: function (password) {
    return when.promise(function(resolve, reject, notify) {
      bcrypt.genSalt(5, function(err, salt) {
        if (err) {
          reject(err);
        }

        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) {
            reject(err);
          }

          resolve(hash);
        });
      });
    });
  },


  comparePassword: function(candidatePassword) {
    let password = this.get('password');

    return when.promise(function(resolve, reject, notify) {
      bcrypt.compare(candidatePassword, password, function(err, isMatch) {
        if (err) {
          reject(err);
        }
        else {
          resolve(isMatch);
        }
      });
    });
  },


  gravatar: function(size, defaults) {
    size = size || 32;
    defaults = defaults || 'retro';

    if (!this.get('email')) {
      return `https://gravatar.com/avatar/?s=${size}&d=${defaults}`;
    }

    let md5 = crypto.createHash('md5').update(this.get('email'));

    return `https://gravatar.com/avatar/${md5.digest('hex').toString()}?s=${size}&d=${defaults}`;
  },


  twitterHandle: function() {
    let handle = false;
    let twitter_url = this.get('twitter_url');

    if (twitter_url) {
      handle = twitter_url.substring(twitter_url.lastIndexOf('/') + 1);
    }

    return handle;
  },



  saving: function (newObj, attr, options) {
    if ((this.hasChanged('views') && !this.isNew()) || this.hasChanged('resetPasswordToken')) {
      return;
    }

    if (this.isNew() || this.hasChanged('password')) {
      return this.generatePasswordHash(this.get('password'))
      .then((hash) => {
        this.set({password: hash});
      })
      .then(() => {
        if (!this.get('slug')) {
          return this.generateSlug(this.get('name'))
          .then((slug) => {
            this.set({slug: slug});
          });
        }
      })
      .then(function () {
        return App.Model.prototype.saving.apply(this, _.toArray(arguments));
      });
    }

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
  },



  /*
   * delete post
  **/
  deleteAccount: function(userId) {
    let user = new User({id: userId});

    return user.fetch({withRelated: ['tokens'], require: true})
    .then(function (model) {
      let tokens = model.related('tokens');

      if (tokens.length > 0) {
        model.tokens().detach();

        return model.destroy();
      }
      else {
        return model.destroy();
      }
    });
  },


  /**
   * GET /account/unlink/:provider
   * Unlink an auth account
   */
  unlink: function(provider) {
    let tokens = this.related('tokens').toJSON();
    let token = _.findWhere(tokens, {kind: provider});
    let Tokens = App.getCollection('Tokens');

    if (token) {
      if (token.kind === 'github') {
        this.set({'github': null});
      }
      if (token.kind === 'twitter') {
        this.set({'twitter': null});
      }
      if (token.kind === 'google') {
        this.set({'google': null});
      }

      return this.save()
      .then(function (user) {
        return Tokens.forge().remove(token.id);
      });
    }
    else {
      return when.resolve();
    }
  },


  viewed: function () {
    let views = this.get('views') || 0;

    return this.save({'views': views + 1}, {patch: true});
  }
});


module.exports = App.addModel('User', User);
