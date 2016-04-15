"use strict";

/**
 * Module dependencies.
 */

var unidecode  = require('unidecode');
var when  = require('when');
var sanitize   = require('validator').sanitize;


module.exports = function (Bookshelf) {
  Bookshelf.Model = Bookshelf.Model.extend({

    hasTimestamps: true,


    initialize: function () {
      this.on('saving', (model, attributes, options) => {
        return this.saving(model, attributes, options);
      });

      this.on('destroying', (model, attributes, options) => {
        this.destroying(model, attributes, options);
      });
    },


    viewed: function () {
      let views = this.get('views');

      return this.save({'views': views + 1}, {patch: true});
    },


    getTableName: function () {
      return this.tableName;
    },


    getJSON: function (props) {
      let json = {};

      props.forEach((prop) => {
        json[prop] = this.get(prop);
      });

      return json;
    },


    saving: function (newObj, attr, options) {
      let table = this.getTableName();

      // if only updating views field
      if (this.hasChanged('views') && !this.isNew() || this.hasChanged('resetPasswordToken')) {
        return false;
      }

      // if user has no access to content
      //if (!self.isNew() && !self.hasPermission()) {
        //throw new Error('Access restricted');
      //}

      // if updating and has updated_by feild, set it to current user
      //if (!self.isNew() && Databases[table].updated_by) {
        //self.set('updated_by', App.user.get('id'));
      //}

      // if is new or slug has changed and has slug field - generate new slug
      if (this.hasChanged('slug') || !this.get('slug') && this.has('slug')) {
        return this.generateSlug(this.get('slug') || this.get('name') || this.get('title'))
          .then( (slug) => {
            this.set({slug: slug});
          });
      }
    },



    sanitize: function (attr) {
      return sanitize(this.get(attr)).xss();
    },



    /**
     * Credit: https://github.com/TryGhost/Ghost
     *
     * ### Generate Slug
     * Create a string to act as the permalink for an object.
     * @param {ghostBookshelf.Model} Model Model type to generate a slug for
     * @param {String} base The string for which to generate a slug, usually a title or name
     * @param {Object} options Options to pass to findOne
     * @return {Promise(String)} Resolves to a unique slug string
    */
    generateSlug: function (base) {
      let self = this;
      let slug;
      let slugTryCount = 1;
      let baseName = self.getTableName().replace(/s$/, '');

      // Look for a post with a matching slug, append an incrementing number if so
      let checkIfSlugExists;

      checkIfSlugExists = function (slugToFind) {
        let args = {slug: slugToFind};

        return self.constructor.forge(args)
          .fetch()
          .then( (found) => {
            let trimSpace;

            if (!found) {
              return when.resolve(slugToFind);
            }

            slugTryCount += 1;

            // If this is the first time through, add the hyphen
            if (slugTryCount === 2) {
              slugToFind += '-';
            } else {
              // Otherwise, trim the number off the end
              trimSpace = -(String(slugTryCount - 1).length);
              slugToFind = slugToFind.slice(0, trimSpace);
            }

            slugToFind += slugTryCount;

            return checkIfSlugExists(slugToFind);
        });
      };

      slug = base.trim();

      // Remove non ascii characters
      slug = unidecode(slug);

      // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
      slug = slug.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
        // Replace dots and spaces with a dash
        .replace(/(\s|\.)/g, '-')
        // Convert 2 or more dashes into a single dash
        .replace(/-+/g, '-')

        .toLowerCase();

      // Remove trailing hyphen
      slug = slug.charAt(slug.length - 1) === '-' ? slug.substr(0, slug.length - 1) : slug;

      // Check the filtered slug doesn't match any of the reserved keywords
      slug = /^(events|edit|new|devs|meetups|devs|account|admin|blog|companies|jobs|logout|login|signin|signup|signout|register|archive|archives|category|categories|tag|tags|page|pages|post|posts|user|users|rss|feed)$/g
              .test(slug) ? slug + '-' + baseName : slug;

      //if slug is empty after trimming use "post"
      if (!slug) {
        slug = baseName;
      }

      // Test for duplicate slugs.
      return checkIfSlugExists(slug);
    }
  });

  return Bookshelf;
};
