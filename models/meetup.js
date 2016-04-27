"use strict";

/**
 * Module dependencies.
 */
const App = require('widget-cms');
const markdown = require('markdown-it')();
const _ = require('lodash');


let Meetup =  App.Model.extend({

  tableName: 'meetups',


  hasTimestamps: true,


  saving: function (model, attr, options) {

    this.set('html', markdown.render(this.get('markdown')));
    this.set('title', this.get('title').trim());

    return App.Model.prototype.saving.apply(this, _.toArray(arguments));
  }
});

module.exports = App.addModel('Meetup', Meetup);
