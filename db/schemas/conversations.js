"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  from_id: {type: 'integer', nullable: true, unsigned: true, references: 'users.id'},
  to_id: {type: 'integer', nullable: true, unsigned: true, references: 'users.id'}
};
