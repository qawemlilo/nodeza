"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  conversation_id: {type: 'integer', nullable: false, unsigned: true, references: 'conversations.id'},
  from_id: {type: 'integer', nullable: true, unsigned: true, references: 'users.id'},
  to_id: {type: 'integer', nullable: true, unsigned: true, references: 'users.id'},
  body: {type: 'text', fieldtype: 'medium', nullable: true},
  html: {type: 'text', fieldtype: 'medium', nullable: true},
  read: {type: 'boolean', nullable: false, defaultTo: false}
};
