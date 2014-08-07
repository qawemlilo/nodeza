/**
 * Module dependencies.
 */

var Base  = require('./base');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Token = require('./token');
var Role = require('./roles');
var Posts = require('../collections/posts');
var Events = require('../collections/events');
var when = require('when');
var _ = require('lodash');




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
    var deferred = when.defer();
  
    bcrypt.genSalt(5, function(err, salt) {
      if (err) {
        deferred.reject(err);
      }
  
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) {
          deferred.reject(err);
        }
        
        deferred.resolve(hash);
      });
    });
  
    return deferred.promise;
  },


  comparePassword: function(candidatePassword) {
    var deferred = when.defer();

    bcrypt.compare(candidatePassword, this.get('password'), function(err, isMatch) {
      if (err) {
        deferred.reject(err);
      }

      deferred.resolve(isMatch);
    });

    return deferred.promise;
  },


  gravatar: function(size, defaults) {
    if (!size) {
      size = 32;
    }

    if (!defaults) {
      defaults = 'retro';
    }
  
    if (!this.get('email')) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
    }
  
    var md5 = crypto.createHash('md5').update(this.get('email'));
    
    return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
  },


  save: function (data, options) {
    var self = this;
    
    data = data || {};

    var password = self.get('password') || data.password;

    if (self.isNew() || self.hasChanged('password')) {
      return self.generatePasswordHash(password)
      .then(function (hash) {
        if (data.password) {
          data.password = hash;
        }
        else {
          self.set({password: hash});
        }
  
        // Save the user with the hashed password
        return Base.Model.prototype.save.call(self, data, options);
      });
    }
    else {
      var args = [].slice.call(arguments, 0);

      return Base.Model.prototype.save.apply(self, args);      
    }

  },



  /*
   * delete post
  **/
  deleteAccount: function(userId) {
    var deferred = when.defer();

    User.forge({id: userId})
    .fetch({withRelated: ['tokens']})
    .then(function (user) {
      var tokens = user.related('tokens');

      if (tokens.length > 0) {
        tokens.detach()
        .then(function () {
          user.destroy()
          .then(function () {
            deferred.resolve();
          });
        })
        .otherwise(function () {
          deferred.reject('Failed to detach tokens');
        });
      }
      else {
        user.destroy()
        .then(function () {
          deferred.resolve();
        });        
      }
    });

    return deferred.promise;
  },
});


module.exports = Base.model('User', User);