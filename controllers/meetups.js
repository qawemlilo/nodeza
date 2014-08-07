
var Meetup = require('../models/meetup');
var Meetups = require('../collections/meetups');
var gulpfile = require('../gulp-images');



module.exports = {

  /*
   * GET /meetups/new
   * load new meetup page
   */
  getNew: function (req, res) {
    res.render('meetups_new', {
      title: 'New Meetup',
      description: 'Create a meetup group',
      page: 'newmeetup'
    });
  },


  /*
   * Post /meetups/limit
   * sets the limit for the number of meetups per page
   */
  setLimit: function (req, res) {
    req.session.elimit = req.body.limit;
    res.redirect('/meetups');
  },


  /*
   * GET /meetups/:slug
   * loads a meetup by slug
   */
  getMeetup: function (req, res) {
    var slug = req.params.slug;

    Meetup.forge({slug: slug})
    .fetch()
    .then(function (meetup) {
      res.render('meetups_meetup', {
        title: meetup.get('title'),
        description: meetup.get('short_desc'),
        page: 'meetup', 
        meetup: meetup.toJSON()
      });

      // count number of views
      meetup.viewed();
    })
    .otherwise(function () {
      res.redirect('/meetups');
    });
  },



  /*
   * GET /meetups/edit/:id
   */
  getEdit: function (req, res) {
    var id = req.params.id;
    var user_id = req.user.get('id');

    Meetup.forge({id: id, user_id: user_id})
    .fetch()
    .then(function (model) {

      res.render('meetups_edit', {
        page: 'meetupedit',
        title: 'Meetup edit',
        description: 'Meetup edit',
        meetup: model.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'You do not have permission to edit that meetup'});
      res.redirect('back');      
    });
  },



  /**
   * GET /meetups
   * get upcoming meetups
   */
  getMeetups: function (req, res, next) {
    var meetups = new Meetups();
  
    meetups.fetchBy('id', {
      where: ['created_at', '<', new Date()],
      andWhere: []
    }, {
      columns: ['title', 'short_desc', 'city', 'slug', 'image_url']
    })
    .then(function (collection) {
      res.render('meetups_meetups', {
        title: 'Find Meetups',
        pagination: collection.pages,
        meetups: collection.toJSON(),
        query: {},
        description: 'Find a meetup group in South Africa',
        page: 'meetups'
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error. Could not fetch meetups.'});
      res.redirect('/');      
    });
  },



  /**
   * GET /account/meetups
   * get upcoming meetups
   */
  getAdmin: function (req, res, next) {
    var meetups = new Meetups();
    var role = req.user.related('role').toJSON(); 
    var opts = {where: ['user_id', '=', req.user.get('id')]};

    if (role.name === 'Super Administrator') {
      opts.where = ['created_at', '<', new Date()];
    }

    meetups.fetchBy('id', opts)
    .then(function (collection) {
      res.render('meetups_admin', {
        title: 'Find Meetups',
        pagination: collection.pages,
        meetups: collection.toJSON(),
        query: {},
        description: 'Find a meetup group in South Africa',
        page: 'adminmeetups'
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error. Could not fetch meetups.'});
      res.redirect('/');      
    });
  },


  /*
   * POST /meetups/new
   * create an meetup
   */
  postNew: function (req, res) {
    req.assert('title', 'Name must be at least 4 characters long').len(4);
    req.assert('short_desc', 'Short description must be at lest 12 characters').len(12);
    req.assert('markdown', 'Details must be at least 12 characters long').len(12);
    req.assert('email', 'Starting cannot be blank').isEmail();
  
    var errors = req.validationErrors();
    var meetupData = {};
    var user = req.user;
    var errMsg = 'Database error. Meetup not created.';
    var successMsg = 'Meetup successfully created!';
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/account/meetups');
    }

    if (req.body.meetup_id) {
      errMsg = 'Database error. Meetup not updated.';
      successMsg = 'Meetup successfully updated!';
      meetupData.id = req.body.meetup_id;
    }

    if (req.files.image_url) {
      meetupData.image_url = req.files.image_url.name;
      
      setTimeout(function () {
        gulpfile('public/temp/' + meetupData.image_url);
      }, 100);
    }

    meetupData.user_id = user.get('id');
    meetupData.title = req.body.title;
    meetupData.short_desc = req.body.short_desc;
    meetupData.organiser = req.body.organiser;
    meetupData.markdown = req.body.markdown;
    meetupData.province = req.body.administrative_area_level_1 || '';
    meetupData.lat = req.body.lat || '';
    meetupData.lng = req.body.lng || '';
    meetupData.city = req.body.locality || '';
    meetupData.town = req.body.sublocality || '';
    meetupData.address = req.body.formatted_address || req.body.geocomplete;
    meetupData.website = req.body.website;
    meetupData.url = req.body.url || '';
    meetupData.email = req.body.email;
    meetupData.number = req.body.number;
    meetupData.meetings = req.body.meetings;


    Meetup.forge(meetupData)
    .save({}, {user: user.get('id')})
    .then(function (model) {
      req.flash('success', { msg: successMsg});
      res.redirect('back');
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': errMsg});
      res.redirect('/account/meetups');
    });
  },





  /*
   * POST /meetups/edit
   * create an meetup
   */
  postEdit: function (req, res) {
    req.assert('title', 'Name must be at least 4 characters long').len(4);
    req.assert('short_desc', 'Short description must be at lest 12 characters').len(12);
    req.assert('markdown', 'Details must be at least 12 characters long').len(12);
    req.assert('email', 'Starting cannot be blank').isEmail();
  
    var errors = req.validationErrors();
    var meetupData = {};
    var user = req.user;
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/account/meetups');
    }

    meetupData.id = req.body.meetup_id;
    meetupData.user_id = user.get('id');
    meetupData.title = req.body.title;
    meetupData.short_desc = req.body.short_desc;
    meetupData.organiser = req.body.organiser;
    meetupData.markdown = req.body.markdown;
    meetupData.province = req.body.administrative_area_level_1 || '';
    meetupData.lat = req.body.lat || '';
    meetupData.lng = req.body.lng || '';
    meetupData.city = req.body.locality || '';
    meetupData.town = req.body.sublocality || '';
    meetupData.address = req.body.formatted_address || req.body.geocomplete;
    meetupData.website = req.body.website;
    meetupData.url = req.body.url || '';
    meetupData.email = req.body.email;
    meetupData.number = req.body.number;
    meetupData.meetings = req.body.meetings;

    if (req.files.image_url) {
      meetupData.image_url = req.files.image_url.name;
      
      setTimeout(function () {
        gulpfile('public/temp/' + meetupData.image_url);
      }, 100);
    }


    Meetup.forge({id: meetupData.id, user_id: meetupData.user_id})
    .fetch()
    .then(function (model) {
      model.save(meetupData, {method: 'update'})
      .then(function () {
        req.flash('success', { msg: 'Meetup successfully updated!'});
        res.redirect('back');
      })
      .otherwise(function (error) {
        req.flash('errors', {'msg': 'Database error. Meetup not updated.'});
        res.redirect('/account/meetups');
      });
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': 'Database error. Meetup not updated.'});
      res.redirect('/account/meetups');
    });
  }
};

