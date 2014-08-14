/**
 * Module dependencies.
**/
var Base  = require('./base');
var when  = require('when');
var markdown = require('markdown').markdown;
var _ = require('lodash');
var moment = require('moment');
var Tag  = require('./tag');
var Tags  = require('../collections/tags');





var Post = Base.Model.extend({

  tableName: 'posts',


  initialize: function () {
    var self = this;

    Base.Model.prototype.initialize.apply(this, arguments);

    this.on('saved', function (model, attributes, options) {
      if (options.updateTags) {
        self.updateTags(model, attributes, options);
      }
    });
  },


  hasTimestamps: true,


  tags: function () {
    return this.belongsToMany('Tag');
  },


  created_by: function () {
    return this.belongsTo('User');
  },


  category: function () {
    return this.belongsTo('Category', 'category_id');
  },


  publishingDate: function (fmt) {
    var dt = this.get('published_at');

    return moment(dt).format(fmt || 'MMMM D, YYYY');
  },


  saving: function (model, attr, options) {
    var self = this;
    
    // if only updating views field
    if (self.hasChanged('views') && !self.isNew()) {
      return;
    }

    self.set('html', markdown.toHTML(self.get('markdown')));

    self.set('title', self.get('title').trim());
    
    // set publishing date if published and notExists
    if (self.hasChanged('published') && self.get('published')) {
      if (!self.get('published_at')) {
        self.set('published_at', new Date());
      }
    }

    return Base.Model.prototype.saving.apply(self, _.toArray(arguments));
  },


  /**
   * Credit: https://github.com/TryGhost/Ghost
   *
   * ### updateTags
   * Update tags that are attached to a post.  Create any tags that don't already exist.
   * @param {Object} newPost
   * @param {Object} attr
   * @param {Object} options
   * @return {Promise(ghostBookshelf.Models.Post)} Updated Post model
  **/
  updateTags: function (newPost, attr, options) {
    var self = this;

    options = options || {};

    self.myTags = options.updateTags || [];


    return Post.forge({id: newPost.id})
    .fetch({withRelated: ['tags'], transacting: options.transacting})
    .then(function (post) {
      var tagOps = [];

      // remove all existing tags from the post
      // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
      // (https://github.com/tgriesser/bookshelf/issues/294)
      tagOps.push(post.tags().detach(null, _.omit(options, 'query')));

      if (_.isEmpty(self.myTags)) {
        return when.all(tagOps);
      }

      return Tags.forge()
      .query('whereIn', 'name', _.pluck(self.myTags, 'name'))
      .fetch(options)
      .then(function (existingTags) {
        var doNotExist = [];
        var createAndAttachOperation;

        existingTags = existingTags.toJSON();

        doNotExist = _.reject(self.myTags, function (tag) {
          return _.any(existingTags, function (existingTag) {
              return existingTag.name === tag.name;
          });
        });

        // Create tags that don't exist and attach to post
        _.each(doNotExist, function (tag) {
          createAndAttachOperation = Tag.forge({name: tag.name}, options).save().then(function (createdTag) {
            createdTag = createdTag.toJSON();

            // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
            // (https://github.com/tgriesser/bookshelf/issues/294)
            return post.tags().attach(createdTag.id, createdTag.name, _.omit(options, 'query'));
          });

          tagOps.push(createAndAttachOperation);
        });

        // attach the tags that already existed
        _.each(existingTags, function (tag) {
          // _.omit(options, 'query') is a fix for using bookshelf 0.6.8
          // (https://github.com/tgriesser/bookshelf/issues/294)
          tagOps.push(post.tags().attach(tag.id, _.omit(options, 'query')));
        });

        return when.all(tagOps);
      });
    });
  },



  /*
   * delete post
  **/
  remove: function(id) {
    var deferred = when.defer();

    Post.forge({id: id})
    .fetch({withRelated: ['tags']})
    .then(function (post) {
      post.related('tags')
      .detach()
      .then(function () {
        post.destroy()
        .then(function () {
          deferred.resolve();
        });
      })
      .otherwise(function (error) {
        deferred.reject(error);
      });
    })
    .otherwise(function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  },



  /**
   * (un)publish post
  */
  togglePublisher: function(id) {
    var deferred = when.defer();

    Post.forge({id: id})
    .fetch({withRelated: ['tags']})
    .then(function (post) {
      var published = post.get('published') ? false : true;
      var opts = {};

      opts.published = published;

      if(published && !post.get('published_at')) {
        opts.published_at = new Date();
      }

      post.save(opts, {patch: true})
      .then(function () {
        deferred.resolve(post);
      })
      .otherwise(function (error) {
        deferred.reject(error);
      });
    })
    .otherwise(function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }

});

module.exports = Base.model('Post', Post);
