

var Events = require('../collections/events');
var Event = require('../models/event');
var moment = require('moment');



module.exports = {

  /*
   * GET /events/new
   * load new event page
  **/
  newEvent: function (req, res) {
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
    req.session.elimit = req.body.limit;
    res.redirect('/events');
  },


  /*
   * GET /events/:id
   * loads an event by id
   */
  getEvent: function (req, res, next) {
    var id = parseInt(req.params.id, 10);

    Event.forge({id: id})
    .fetch()
    .then(function (event) {
      if(!event) {
        req.flash('errors', {'msg': 'Database error. Could not fetch event.'});
        return res.redirect('/events');
      }

      res.render('events_event', {
        title: 'Event',
        parseDate: event.parseDate(),
        parseTime: event.parseTime(),
        isUpComing: event.isUpComing(),
        myEvent: event.toJSON(),
        description: 'Node.js event in ' + event.get('city'),
        page: 'event'
      });

      event.viewed();
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': 'Database error. Could not fetch event.'});
      res.redirect('/events');
    });
  },



  /**
   * GET /events
   * get upcoming events
   */
  getEvents: function (req, res, next) {
    var events = new Events();
  
    var page = parseInt(req.query.p, 10);
    var sortby = req.query.sortby;
    var order = req.query.order;
    var query = {};

    var previousSortby = req.session.previousSortby;
    var previousOrder = req.session.previousOrder;
  
    if (page && page < 1) {
      res.redirect('/events');
    }
  
    events.currentpage = page || 1;
    events.limit = req.session.elimit || 5;
  
    if(sortby) {
      events.sortby = sortby;
      
      // if a sort link is clicked several times
      if (previousSortby == sortby && !page) {
        events.order = (previousOrder === 'asc' ? 'desc' : 'asc');
      }
      // if checking pages of sorted results
      else if (page){
        events.order = previousOrder;
      }
      // if clicking a different sort link
      else {
        events.order = 'asc';
      }

      query.sort = events.sortby;
      query.order = events.order;
    }

    query.limit = events.limit;
      
    req.session.previousSortby = events.sortby;
    req.session.previousOrder = events.order;
  
  
    events.fetchItems()
    .then(function (collection) {
      
      res.render('events_events', {
        title: 'Events',
        pagination: collection.paginated,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in South Africa',
        page: 'events'
      });
    })
    .otherwise(function () {
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');      
    });
  },


  /**
   * GET /events
   * get upcoming events
   */
  getEventsAdmin: function (req, res, next) {
    var events = new Events();
  
    var page = parseInt(req.query.p, 10);
    var sortby = req.query.sortby;
    var order = req.query.order;
    var query = {};

    var previousSortby = req.session.previousSortby;
    var previousOrder = req.session.previousOrder;
  
    if (page && page < 1) {
      res.redirect('/events');
    }
  
    events.currentpage = page || 1;
    events.limit = req.session.elimit || 5;
    events.base = '/admin/events';
    events.andWhereQuery = ['user_id', '=', req.user.get('id')];
  
    if(sortby) {
      events.sortby = sortby;
      
      // if a sort link is clicked several times
      if (previousSortby == sortby && !page) {
        events.order = (previousOrder === 'asc' ? 'desc' : 'asc');
      }
      // if checking pages of sorted results
      else if (page){
        events.order = previousOrder;
      }
      // if clicking a different sort link
      else {
        events.order = 'asc';
      }

      query.sort = events.sortby;
      query.order = events.order;
    }

    query.limit = events.limit;
      
    req.session.previousSortby = events.sortby;
    req.session.previousOrder = events.order;
  
  
    events.fetchMyEvents()
    .then(function (collection) {
      res.render('events_admin', {
        title: 'Events',
        pagination: collection.paginated,
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
   * create an event
   */
  postNewEvent: function (req, res) {
    req.assert('title', 'Title must be at least 4 characters long').len(4);
    req.assert('desc', 'Details must be at least 12 characters long').len(12);
    req.assert('date', 'Date cannot be blank').notEmpty();
    req.assert('start_time', 'Starting cannot be blank').notEmpty();
    req.assert('email', 'Starting cannot be blank').isEmail();
    req.assert('administrative_area_level_1', 'Please make sure location is showing in map').notEmpty();
  
    var errors = req.validationErrors();
    var eventData = {};
    var user = req.user;
    var cleanDate = (req.body.date).split('/').join(' ');
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/events/new');
    }

    eventData.user_id = user.get('id');
    eventData.title = req.body.title;
    eventData.desc = req.body.desc;
    eventData.dt = moment(cleanDate, 'MM DD YYYY').format('YYYY-MM-DD');
    eventData.start_time = moment(req.body.start_time, 'h:mm A').format('HH:mm:ss');
    eventData.finish_time = moment(req.body.finish_time, 'h:mm A').format('HH:mm:ss');
    eventData.province = req.body.administrative_area_level_1;
    eventData.city = req.body.locality;
    eventData.town = req.body.sublocality;
    eventData.address = req.body.formatted_address;
    eventData.website = req.body.webpage;
    eventData.url = req.body.url;
    eventData.email = req.body.email;
    eventData.number = req.body.number;


    Event.forge(eventData)
    .save()
    .then(function (model) {
      if (!model) {
        req.flash('errors', {'msg': 'Database error. Event not created.'});
      }
      else {
      	req.flash('success', { msg: 'Event successfully created!' });
      }

      res.redirect('/events/new');
    })
    .otherwise(function (error) {
      req.flash('errors', {'msg': 'Database error. Event not created.'});
      res.redirect('/events/new');
    });
  }
};

