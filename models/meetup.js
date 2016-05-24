"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');
const markdown = require('markdown-it')();
const _ = require('lodash');


const Meetup =  App.Model.extend({

  tableName: 'meetups',


  hasTimestamps: true,


  saving: function (model, attr, options) {
    
    if ((this.hasChanged('views') && !this.isNew())) {
      return;
    }

    if (this.get('updated_by') && options.context && options.context.user_id) {
      this.set('updated_by', options.context.user_id);
    }
    // if is new or slug has changed and has slug field - generate new slug
    if (!this.get('slug') || this.hasChanged('slug')) {
      return this.generateSlug(this.get('slug') || this.get('name') || this.get('title'))
        .then( (slug) => {
          this.set({slug: slug});
        });
    }

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
  },


  viewed: function () {
    let views = this.get('views') || 0;

    return this.save({'views': views + 1}, {patch: true});
  }

});

module.exports = App.addModel('Meetup', Meetup);
