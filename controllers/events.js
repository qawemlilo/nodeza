

var Events = require('../collections/events');
var Event = require('../models/event');
var moment = require('moment');



function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = {

  /*
   * GET /events/new
   * load new event page
  **/
  getNew: function (req, res) {
    res.render('events_new', {
      title: 'New Event',
      description: 'Create a new Node.js event',
      page: 'newevent'
    });
  },


  /*
   * Post /events/limit
   * sets the limit for the number of events per page
   */
  setLimit: function (req, res) {
    req.session.elimit = parseInt(req.body.limit, 10);
    res.redirect('back');
  },


  /*
   * GET /events/:id
   * loads an event by id
   */
  getEvent: function (req, res, next) {
    var slug = req.params.slug;

    Event.forge({slug: slug})
    .fetch()
    .then(function (event) {
      res.render('events_event', {
        title: event.get('title'),
        parseDate: event.parseDate(),
        parseTime: event.parseTime(),
        isUpComing: event.isUpComing(),
        myEvent: event.toJSON(),
        description: event.get('title'),
        page: 'event'
      });

      event.viewed();
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': 'Database error. Could not fetch event.'});
      res.redirect('/events');
    });
  },



  /*
   * GET /events/edit/:id
   */
  getEdit: function (req, res) {
    var id = req.params.id;
    var user_id = req.user.get('id');

    Event.forge({id: id, user_id: user_id})
    .fetch()
    .then(function (model) {
      res.render('events_edit', {
        page: 'eventedit',
        title: 'Event edit',
        description: 'MeeEvent edit',
        event: model.toJSON()
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'You do not have permission to edit that meetup'});
      res.redirect('back');      
    });
  },



  /**
   * GET /events
   * get upcoming events
   */
  getEvents: function (req, res, next) {
    var events = new Events();
  
    var page = parseInt(req.query.p, 10);
    var query = {};
    var currentpage = page || 1;
    var limit = req.session.elimit || 2;
    var month = req.query.month || '';
    var monthObj;

    query.limit = limit;
    query.month = month;
  
    if (currentpage < 1) {
      res.redirect('/events');
    }

    var fetchQuery = {
      limit: limit,
      order: 'asc',
      page: currentpage,
      where: ['dt', '>', datetime()]
    };

    if (month) {
      monthObj = events.parseMonth(month.trim());

      fetchQuery.where = ['dt', '>', monthObj.firstday];
      fetchQuery.andWhere = ['dt', '<', monthObj.lastday];
    }

    events.fetchBy('dt', fetchQuery, {
      columns: ['slug', 'title', 'url', 'city', 'desc', 'dt', 'start_time', 'address']
    })
    .then(function (collection) {
      res.render('events_events', {
        title: 'Events',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in South Africa',
        page: 'events'
      });
    })
    .otherwise(function (error) {
      console.log(error);
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');      
    });
  },



  /**
   * GET /events/city/:city
   * get upcoming events
   */
  getEventsByCity: function (req, res, next) {
    var events = new Events();
  
    var page = parseInt(req.query.p, 10);
    var query = {};
    var currentpage = page || 1;
    var limit = req.session.elimit || 2;
    var city = req.params.city || '';
    var month = req.query.month || '';

    query.limit = limit;
    query.month = month;
  
    if (currentpage < 1) {
      res.redirect('/events');
    }

    var fetchQuery = {
      limit: limit,
      order: 'asc',
      page: currentpage,
      where: ['city', '=', city]
    };

    if(month) {
      monthObj = events.parseMonth(month.trim());

      fetchQuery.where = ['dt', '>', monthObj.firstday];
      fetchQuery.andWhere = ['dt', '<', monthObj.lastday];
    }

    
    events.base = '/events/city/' + city;

    events.fetchBy('dt', fetchQuery, {
      columns: ['slug', 'title', 'url', 'city', 'desc', 'dt', 'start_time', 'address']
    })
    .then(function (collection) {
      res.render('events_events', {
        title: 'Events',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in ' + city,
        page: 'events'
      });
    })
    .otherwise(function (error) {
      console.log(error);
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');      
    });
  },


  /**
   * GET /events
   * get events admin
   */
  getAdmin: function (req, res, next) {
    var events = new Events();
  
    var page = parseInt(req.query.p, 10);
    var query = {};
    var currentpage = page || 1;
    var limit = 10;
  
    if (currentpage < 1) {
      res.redirect('/account/events');
    }
  
    events.base = '/account/events';

    events.fetchBy('id', {
      limit: limit,
      order: 'desc',
      page: currentpage,
      where: ['user_id', '=', req.user.get('id')],
      andWhere: []
    })
    .then(function (collection) {
      res.render('events_admin', {
        title: 'Events',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in South Africa',
        page: 'adminevents'
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');      
    });
  },


  /*
   * POST /events/new
   * save a new event
   */
  postNew: function (req, res) {
    req.assert('title', 'Title must be at least 4 characters long').len(4);
    req.assert('desc', 'Details must be at least 12 characters long').len(12);
    req.assert('date', 'Date cannot be blank').notEmpty();
    req.assert('start_time', 'Starting cannot be blank').notEmpty();
    req.assert('email', 'Starting cannot be blank').isEmail();
  
    var errors = req.validationErrors();
    var eventData = {};
    var user = req.user;
    var cleanDate = (req.body.date).split('/').join(' ');
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/events/new');
    }

    if (req.body.id) {
      eventData.id = req.body.id;
    }

    console.log(req.body);

    eventData.user_id = user.get('id');
    eventData.title = req.body.title;
    eventData.desc = req.body.desc;
    eventData.dt = moment(cleanDate, 'MM DD YYYY').format('YYYY-MM-DD');
    eventData.start_time = moment(req.body.start_time, 'h:mm A').format('HH:mm:ss');
    eventData.finish_time = moment(req.body.finish_time, 'h:mm A').format('HH:mm:ss');
    eventData.province = req.body.administrative_area_level_1 || '';
    eventData.city = req.body.locality || '';
    eventData.town = req.body.sublocality || '';
    eventData.address = req.body.formatted_address || '';
    eventData.website = req.body.webpage;
    eventData.url = req.body.url;
    eventData.lng = req.body.lng;
    eventData.lat = req.body.lat;
    eventData.email = req.body.email;
    eventData.number = req.body.number;


    Event.forge(eventData)
    .save()
    .then(function (model) {
      req.flash('success', { msg: 'Event successfully created!' });
      res.redirect('back');
    })
    .otherwise(function (error) {
      console.log(error);

      req.flash('errors', {'msg': 'Database error. Event not created.'});
      res.redirect('/events/new');
    });
  },


  /*
   * POST /events/edit
   * save update
   */
  postEdit: function (req, res) {
    req.assert('title', 'Title must be at least 4 characters long').len(4);
    req.assert('desc', 'Details must be at least 12 characters long').len(12);
    req.assert('date', 'Date cannot be blank').notEmpty();
    req.assert('start_time', 'Starting cannot be blank').notEmpty();
    req.assert('email', 'Starting cannot be blank').isEmail();
  
    var errors = req.validationErrors();
    var eventData = {};
    var user = req.user;
    var cleanDate = (req.body.date).split('/').join(' ');
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }
    
    eventData.id = req.body.event_id;
    eventData.user_id = user.get('id');
    eventData.title = req.body.title;
    eventData.desc = req.body.desc;
    eventData.dt = moment(cleanDate, 'MM DD YYYY').format('YYYY-MM-DD');
    eventData.start_time = moment(req.body.start_time, 'h:mm A').format('HH:mm:ss');
    eventData.finish_time = moment(req.body.finish_time, 'h:mm A').format('HH:mm:ss');
    eventData.province = req.body.administrative_area_level_1 || '';
    eventData.city = req.body.locality || '';
    eventData.town = req.body.sublocality || '';
    eventData.address = req.body.formatted_address || '';
    eventData.website = req.body.webpage;
    eventData.url = req.body.url;
    eventData.lng = req.body.lng;
    eventData.lat = req.body.lat;
    eventData.email = req.body.email;
    eventData.number = req.body.number;

    Event.forge({id: eventData.id, user_id: eventData.user_id})
    .fetch()
    .then(function (model) {
      console.log(model.toJSON());

      model.save(eventData, {method: 'update'})
      .then(function () {
        req.flash('success', { msg: 'Event successfully updated!' });
        res.redirect('back');
      })
      .otherwise(function (error) {
        console.log(error);
        req.flash('errors', {'msg': 'Database error. Event not updated.'});
        res.redirect('back');
      });
    })
    .otherwise(function (error) {
      console.log(error);
      req.flash('errors', {'msg': 'Database error. Event not found.'});
      res.redirect('back');
    });
  },



  /**
   * GET /blog/delete
   * delete event
  */
  getDelete: function(req, res) {
    Event.forge({id: req.params.id, user_id: req.user.get('id')})
    .fetch()
    .then(function (event) {
      event.destroy()
      .then(function () {
        req.flash('success', {msg: 'Event successfully deleted.'});
        res.redirect('back');
      })
      .otherwise(function () {
        req.flash('error', {msg: 'Database error. Event not deleted.'});
        res.redirect('back');
      });
    })
    .otherwise(function () {
      req.flash('error', {msg: 'You do not have permission to perform action.'});
      res.redirect('back');
    });
  },

};

