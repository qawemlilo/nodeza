"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  title: {type: 'string', maxlength: 150, nullable: false},
  slug: {type: 'string', maxlength: 200, nullable: false, unique: true},
  cover: {type: 'string', maxlength: 200, nullable: true},
  cover_directory: {type: 'string', maxlength: 200, nullable: true},
  description: {type: 'string', maxlength: 200, nullable: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
