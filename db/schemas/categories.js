"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  name: {type: 'string', maxlength: 200, nullable: false},
  slug: {type: 'string', maxlength: 254, nullable: false, unique: true},
  description: {type: 'string', maxlength: 254, nullable: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null},
};
