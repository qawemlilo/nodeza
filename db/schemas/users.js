"use strict";

module.exports =  {
  id: {type: 'increments', nullable: false, primary: true},
  role_id: {type: 'integer', nullable: false, unsigned: true, references: 'roles.id'},
  image_id: {type: 'integer', nullable: true, unsigned: true, references: 'images.id'},
  name: {type: 'string', maxlength: 200, nullable: false},
  last_name: {type: 'string', maxlength: 200, nullable: true},
  slug: {type: 'string', maxlength: 254, nullable: false, unique: true},
  email: {type: 'string', maxlength: 254, nullable: false, unique: true, validations: {'isEmail': true}},
  password: {type: 'string', maxlength: 254, nullable: false},
  resetPasswordToken: {type: 'string', maxlength: 254, nullable: true, defaultTo: null},
  resetPasswordExpires: {type: 'dateTime', nullable: true, defaultTo: null},
  gender: {type: 'string', maxlength: 8, nullable: true, defaultTo: ''},
  location: {type: 'string', maxlength: 254, nullable: true, defaultTo: ''},
  website: {type: 'text', maxlength: 2000, nullable: true, defaultTo: '', validations: {'isURL': true}},
  twitter: {type: 'string', maxlength: 200, nullable: true, defaultTo: ''},
  github: {type: 'string', maxlength: 200, nullable: true, defaultTo: ''},
  google: {type: 'string', maxlength: 200, nullable: true, defaultTo: null},
  about: {type: 'string', maxlength: 254, nullable: true, defaultTo: ''},
  github_url: {type: 'text', nullable: true, validations: {'isURL': true}},
  twitter_url: {type: 'text', nullable: true, defaultTo: '', validations: {'isURL': true}},
  image_url: {type: 'text', nullable: true, defaultTo: ''},
  views: {type: 'integer', nullable: true, defaultTo: 0},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
