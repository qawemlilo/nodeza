"use strict";

/**
 * Module dependencies.
 */

const App = require('widget-cms');
const moment = require('moment');
const markdown = require('markdown-it')();
const _ = require('lodash');


const nodeEvent = App.Model.extend({

  tableName: 'events',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    if ((this.hasChanged('views') && !this.isNew())) {
      return;
    }

    this.set('html', markdown.render(this.get('markdown')));
    this.set('title', this.get('title').trim());

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


  /**
   * parses date
   */
  parseDate: function (fmt) {
  	let dt = this.get('dt');

    return moment(dt).format(fmt || 'ddd MMM D YYYY');
  },


  /**
   * parses time
   */
  parseTime: function (fmt) {
  	let ts = this.get('start_time');

    return moment(ts, 'HH:mm:ss').format(fmt || 'HH:mm');
  },


  viewed: function () {
    let views = this.get('views') || 0;

    return this.save({'views': views + 1}, {patch: true});
  }
});



module.exports = App.addModel('Event', nodeEvent);
