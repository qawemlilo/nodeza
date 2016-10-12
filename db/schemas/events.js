"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
  image_id: {type: 'integer', nullable: true, unsigned: true, references: 'images.id'},
  title: {type: 'string', maxlength: 200, nullable: false},
  slug: {type: 'string', maxlength: 254, nullable: false, unique: true},
  email: {type: 'string', maxlength: 254, nullable: true},
  number: {type: 'string', maxlength: 24, nullable: true},
  short_desc: {type: 'string', maxlength: 254, nullable: true},
  markdown: {type: 'text', fieldtype: 'medium', nullable: true, defaultTo: ''},
  html: {type: 'text', fieldtype: 'medium', nullable: true, defaultTo: ''},
  dt: {type: 'date', nullable: false},
  start_time: {type: 'time', nullable: true},
  finish_time: {type: 'time', nullable: true},
  province: {type: 'string', maxlength: 64, nullable: true},
  city: {type: 'string', maxlength: 254, nullable: true},
  town: {type: 'string', maxlength: 254, nullable: true},
  address: {type: 'text', maxlength: 2000, nullable: true},
  lat: {type: 'string', nullable: true, maxlength: 32},
  lng: {type: 'string', nullable: true, maxlength: 32},
  url: {type: 'text', nullable: true, validations: {'isURL': true}},
  website: {type: 'text', nullable: true, validations: {'isURL': true}},
  views: {type: 'integer', nullable: true, defaultTo: 0},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
