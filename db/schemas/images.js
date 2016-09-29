"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  album_id: {type: 'integer', nullable: true, unsigned: true, references: 'albums.id'},
  title: {type: 'string', maxlength: 150, nullable: false},
  slug: {type: 'string', maxlength: 200, nullable: false, unique: true},
  filename: {type: 'string', maxlength: 200, nullable: false},
  directory: {type: 'string', maxlength: 200, nullable: false},
  type: {type: 'string', maxlength: 16, nullable: false},
  description: {type: 'string', maxlength: 200, nullable: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
