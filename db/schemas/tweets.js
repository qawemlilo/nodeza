"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  type: {type: 'enum', nullable: false, values: ['post','event','text','news','funfact']},
  payload: {type: 'json', nullable: false}
};
