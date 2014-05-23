var db = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    role_id: {type: 'integer', nullable: false},
    name: {type: 'string', maxlength: 150, nullable: false},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true, validations: {'isEmail': true}},
    password: {type: 'string', maxlength: 254, nullable: false},
    resetPasswordToken: {type: 'string', maxlength: 254, nullable: true},
    resetPasswordExpires: {type: 'dateTime', nullable: true},
    gender: {type: 'string', maxlength: 8, nullable: true},
    last_name: {type: 'string', maxlength: 150, nullable: true},
    location: {type: 'string', maxlength: 254, nullable: true},
    website: {type: 'text', maxlength: 2000, nullable: true, validations: {'isURL': true}},
    twitter: {type: 'string', maxlength: 150, nullable: false},
    github: {type: 'string', maxlength: 64, nullable: true},
    about: {type: 'string', maxlength: 254, nullable: true},
    about: {type: 'string', maxlength: 254, nullable: true},
    image_url: {type: 'text', maxlength: 2000, nullable: true},
    created_at: {type: 'dateTime', nullable: false},
    updated_at: {type: 'dateTime', nullable: true}
  },

  events: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false},
    title: {type: 'string', maxlength: 150, nullable: false},
    email: {type: 'string', maxlength: 254, nullable: false, validations: {'isEmail': true}},
    number: {type: 'string', maxlength: 24, nullable: false},
    desc: {type: 'string', maxlength: 254, nullable: false},
    dt: {type: 'date', nullable: false},
    start_time: {type: 'time', nullable: false},
    finish_time: {type: 'time', nullable: true},
    province: {type: 'string', maxlength: 32, nullable: false},
    city: {type: 'string', maxlength: 254, nullable: false},
    town: {type: 'string', maxlength: 254, nullable: false},
    address: {type: 'text', maxlength: 2000, nullable: false},
    lat: {type: 'double', nullable: false},
    lng: {type: 'double', nullable: false},
    website: {type: 'text', maxlength: 2000, nullable: true, validations: {'isURL': true}},
    url: {type: 'text', maxlength: 2000, nullable: true, validations: {'isURL': true}},
    created_at: {type: 'dateTime', nullable: false},
    updated_at: {type: 'dateTime', nullable: true}
  },

  posts: {
    id: {type: 'increments', nullable: false, primary: true},
    title: {type: 'string', maxlength: 150, nullable: false},
    slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
    markdown: {type: 'text', maxlength: 16777215, fieldtype: 'medium', nullable: true},
    html: {type: 'text', maxlength: 16777215, fieldtype: 'medium', nullable: true},
    image: {type: 'text', maxlength: 2000, nullable: true},
    featured: {type: 'bool', nullable: false, defaultTo: false, validations: {'isIn': [[false, true]]}},
    page: {type: 'bool', nullable: false, defaultTo: false, validations: {'isIn': [[false, true]]}},
    status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'draft'},
    language: {type: 'string', maxlength: 6, nullable: false, defaultTo: 'en_US'},
    meta_title: {type: 'string', maxlength: 150, nullable: true},
    meta_description: {type: 'string', maxlength: 200, nullable: true},
    author_id: {type: 'integer', nullable: false},
    created_at: {type: 'dateTime', nullable: false},
    created_by: {type: 'integer', nullable: false},
    updated_at: {type: 'dateTime', nullable: true},
    updated_by: {type: 'integer', nullable: true},
    published_at: {type: 'dateTime', nullable: true},
    published_by: {type: 'integer', nullable: true}
  },

  roles: {
    id: {type: 'increments', nullable: false, primary: true},
    role: {type: 'string', maxlength: 32, nullable: false}
  },

  tags: {
    id: {type: 'increments', nullable: false, primary: true},
    name: {type: 'string', maxlength: 150, nullable: false},
    slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
    description: {type: 'string', maxlength: 200, nullable: true},
    parent_id: {type: 'integer', nullable: true},
    meta_title: {type: 'string', maxlength: 150, nullable: true},
    meta_description: {type: 'string', maxlength: 200, nullable: true},
    created_at: {type: 'dateTime', nullable: false},
    created_by: {type: 'integer', nullable: false},
    updated_at: {type: 'dateTime', nullable: true},
    updated_by: {type: 'integer', nullable: true}
  }
};

function isPost(jsonData) {
  return jsonData.hasOwnProperty('html') && jsonData.hasOwnProperty('markdown') &&
        jsonData.hasOwnProperty('title') && jsonData.hasOwnProperty('slug');
}

function isTag(jsonData) {
  return jsonData.hasOwnProperty('name') && jsonData.hasOwnProperty('slug')
    && jsonData.hasOwnProperty('description') && jsonData.hasOwnProperty('parent_id');
}




module.exports.tables = db;
module.exports.checks = {
  isPost: isPost,
  isTag: isTag
};
