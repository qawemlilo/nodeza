/**
 * Module dependencies.
 */
var MySql  = require('bookshelf').PG;
var User  = require('./user');
var unidecode  = require('unidecode');
var when  = require('when');


module.exports.Model = MySql.Model.extend({

  initialize: function () {
    var self = this;
    var options = arguments[1] || {};
    //
    // make options include available for toJSON()
    if (options.include) {
      this.include = _.clone(options.include);
    }

    this.on('saving', function (model, attributes, options) {
      return self.saving();
    });
  },


  getTableName: function () {
    return this.tableName;
  },


  saving: function () {
    var self = this;
    
    if (self.hasChanged('slug') || !self.get('slug')) {
      // Pass the new slug through the generator to strip illegal characters, detect duplicates
      return self.generateSlug(self.get('slug') || self.get('name') || self.get('title'))
        .then(function (slug) {
          self.set({slug: slug});
        });
    }
  },


  created_by: function () {
    return this.belongsTo(User);
  },



  /**
   * *This method was taken from Ghost
   * ### Generate Slug
   * Create a string to act as the permalink for an object.
   * @param {ghostBookshelf.Model} Model Model type to generate a slug for
   * @param {String} base The string for which to generate a slug, usually a title or name
   * @param {Object} options Options to pass to findOne
   * @return {Promise(String)} Resolves to a unique slug string
  */
  generateSlug: function (base) {
    var self = this;
    var slug;
    var slugTryCount = 1;
    var baseName = self.getTableName().replace(/s$/, '');
    // Look for a post with a matching slug, append an incrementing number if so
    var checkIfSlugExists;
    //
    checkIfSlugExists = function (slugToFind) {
      var args = {slug: slugToFind};

      return self.constructor.forge(args)
        .fetch()
        .then(function (found) {
        var trimSpace;
        //
        if (!found) {
          return when.resolve(slugToFind);
        }
        //
        slugTryCount += 1;
        //
        // If this is the first time through, add the hyphen
        if (slugTryCount === 2) {
          slugToFind += '-';
        } else {
          // Otherwise, trim the number off the end
          trimSpace = -(String(slugTryCount - 1).length);
          slugToFind = slugToFind.slice(0, trimSpace);
        }
        //
        slugToFind += slugTryCount;
        //
        return checkIfSlugExists(slugToFind);
      });
    };
    //
    slug = base.trim();
    //
    // Remove non ascii characters
    slug = unidecode(slug);
    //
    // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
    slug = slug.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
      // Replace dots and spaces with a dash
      .replace(/(\s|\.)/g, '-')
      // Convert 2 or more dashes into a single dash
      .replace(/-+/g, '-')
      // Make the whole thing lowercase
      .toLowerCase();
    //
    // Remove trailing hyphen
    slug = slug.charAt(slug.length - 1) === '-' ? slug.substr(0, slug.length - 1) : slug;

    //
    //if slug is empty after trimming use "post"
    if (!slug) {
      slug = baseName;
    }
    // Test for duplicate slugs.
    return checkIfSlugExists(slug);
  }
});
