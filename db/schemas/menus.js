"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  name: {type: 'string', maxlength: 150, nullable: false, unique: true},
  role_id: {type: 'integer', nullable: false, unsigned: true, references: 'roles.id'},
  description: {type: 'string', maxlength: 250, nullable: true},
  published: {type: 'boolean', nullable: false, defaultTo: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
