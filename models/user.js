"use strict";

/**
 * Module dependencies.
**/
const App = require('widget-cms');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Promise = require('bluebird');
const _ = require('lodash');


const User = App.Model.extend({

  tableName: 'users',


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
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(5, function(err, salt) {
        if (err) {
          return reject(err);
        }

        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) {
            return reject(err);
          }

          resolve(hash);
        });
      });
    });
  },


  comparePassword: function(candidatePassword) {
    let password = this.get('password');

    return new Promise(function(resolve, reject) {
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



  creating: function (newObj, attr, options) {
    return this.generatePasswordHash(this.get('password'))
    .then((hash) => {
      this.set({password: hash});
    })
    .then(() => {
        return this.generateSlug(this.get('name'))
        .then((slug) => {
          console.log('creating', slug)
          this.set({slug: slug});
        });
    });
  },



  saving: function (newObj, attr, options) {
    return this.generatePasswordHash(this.get('password'))
    .then((hash) => {
      if (this.hasChanged('password')) {
        this.set({password: hash});
      }
    })
    .then(() => {
      if (this.hasChanged('name')) {
        return this.generateSlug(this.get('name'))
        .then((slug) => {
          this.set({slug: slug});
        });
      }
    });
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
        return tokens.invokeThen('destroy')
        .then(function () {
          return model.destroy();
        });
      }
      else {
        return model.destroy();
      }
    })
  },


  /**
   * GET /account/unlink/:provider
   * Unlink an auth account
   */
  unlink: function(provider) {
    let tokens = this.related('tokens').toJSON();
    let token = _.find(tokens, {kind: provider});
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
      return Promise.resolve(null);
    }
  },


  viewed: function () {
    let views = this.get('views') || 0;

    return this.save({'views': views + 1}, {patch: true});
  },


  unreadmessages: function () {
    return this.hasMany('Message','to_id').query('where', 'read', '=', 0);
  }
});


module.exports = App.addModel('User', User);
