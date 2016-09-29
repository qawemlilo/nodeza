"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  name: {type: 'string', nullable: false, maxlength: 64},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
