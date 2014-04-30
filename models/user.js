/**
 * Module dependencies.
 */
var MySql  = require('bookshelf').PG;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Tokens = require('./token');
var Roles = require('./roles');


module.exports = MySql.Model.extend({

  tableName: 'users',

  hasTimestamps: true,


  tokens: function() {
    return this.hasMany(Tokens);
  },


  role: function() {
    return this.belongsTo(Roles);
  },


  generatePasswordHash: function(password, next) {
    bcrypt.genSalt(5, function(err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
      
        password = hash;
        next(false, password);
      });
    });
  },


  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.get('password'), function(err, isMatch) {
      if (err) {
      	return cb(err);
      }

      cb(null, isMatch);
    });
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
  }
});
