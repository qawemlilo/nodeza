"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  role_id: {type: 'integer', nullable: false, unsigned: true, references: 'roles.id'},
  path: {type: 'string', maxlength: 250, nullable: false, unique: true},
  http_method: {type: 'string', maxlength: 12, nullable: false},
  controller_name: {type: 'string', maxlength: 150, nullable: false},
  controller_method: {type: 'string', maxlength: 150, nullable: false},
  published: {type: 'boolean', nullable: false, defaultTo: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
