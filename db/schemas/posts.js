"use strict";

module.exports = {
  id: {type: 'increments', nullable: false, primary: true},
  user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
  category_id: {type: 'integer', nullable: false, unsigned: true, references: 'categories.id'},
  image_id: {type: 'integer', nullable: true, unsigned: true, references: 'images.id'},
  title: {type: 'string', maxlength: 200, nullable: false},
  slug: {type: 'string', maxlength: 254, nullable: false, unique: true},
  markdown: {type: 'text', fieldtype: 'medium', nullable: true},
  html: {type: 'text', fieldtype: 'medium', nullable: true},
  image_url: {type: 'text', nullable: true},
  featured: {type: 'boolean', nullable: false, defaultTo: false},
  published: {type: 'boolean', nullable: false, defaultTo: false},
  curated: {type: 'boolean', nullable: false, defaultTo: false},
  meta_keywords: {type: 'string', maxlength: 200, nullable: true},
  meta_description: {type: 'string', maxlength: 200, nullable: true},
  views: {type: 'integer', nullable: true, defaultTo: 0},
  published_at: {type: 'dateTime', nullable: true},
  updated_by:{type: 'integer', nullable: true, unsigned: true}
};
