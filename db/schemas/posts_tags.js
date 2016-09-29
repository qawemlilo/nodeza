"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  post_id: {type: 'integer', nullable: false, unsigned: true},
  tag_id: {type: 'integer', nullable: false, unsigned: true}
};
