"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  route_id: {type: 'integer', nullable: true, unsigned: true, references: 'routes.id'},
  menu_id: {type: 'integer', nullable: true, unsigned: true, references: 'menus.id'},
  parentId: {type: 'integer', nullable: true, unsigned: true},
  inner_text: {type: 'string', maxlength: 150, nullable: false},
  class_attr: {type: 'string', maxlength: 150, nullable: false},
  id_attr: {type: 'string', maxlength: 150, nullable: false},
  title: {type: 'string', maxlength: 250, nullable: true},
  target: {type: 'string', maxlength: 150, nullable: true},
  icon: {type: 'string', maxlength: 150, nullable: true},
  published: {type: 'boolean', nullable: false, defaultTo: true},
  updated_by: {type: 'integer', nullable: true, unsigned: true, defaultTo: null}
};
