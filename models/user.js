"use strict";

/**
 * Module dependencies.
**/
var Base  = require('./base');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var when = require('when');
var node = require('when/node');
var _ = require('lodash');
var Tokens = require('./token');


var User = Base.Model.extend({

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
    var password = this.get('password');

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
      return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
    }

    var md5 = crypto.createHash('md5').update(this.get('email'));

    return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
  },


  twitterHandle: function() {
    var handle = false;
    var twitter_url = this.get('twitter_url');

    if (twitter_url) {
      handle = twitter_url.substring(twitter_url.lastIndexOf('/') + 1);
    }

    return handle;
  },



  saving: function (newObj, attr, options) {
    var self = this;

    if (self.isNew() || self.hasChanged('password')) {
      return self.generatePasswordHash(self.get('password'))
      .then(function (hash) {
        self.set({password: hash});

        return Base.Model.prototype.saving.apply(self, _.toArray(arguments));
      });
    }

    return Base.Model.prototype.saving.apply(self, _.toArray(arguments));
  },



  /*
   * delete post
  **/
  deleteAccount: function(userId) {
    var user = new User({id: userId});

    return user.fetch({withRelated: ['tokens'], require: true})
    .then(function (model) {
      var tokens = model.related('tokens');

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
    var tokens = this.related('tokens').toJSON();
    var token = _.findWhere(tokens, {kind: provider});

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
  }
});


module.exports = Base.model('User', User);
