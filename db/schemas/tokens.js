"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
  kind: {type: 'string', nullable: true, maxlength: 64},
  accessToken: {type: 'string', maxlength: 254, nullable: true},
  tokenSecret: {type: 'string', maxlength: 254, nullable: true}
};
