"use strict";


const App = require('widget-cms');
const Events = App.getCollection('Events');
const nodeEvent = App.getModel('Event');
const moment = require('moment');


const EventsController = App.Controller.extend({

  /*
   * GET /events/new
   * load new event page
  **/
  getNew: function (req, res) {
    res.render('events/new', {
      title: 'New Event',
      description: 'Create a new Node.js event',
      page: 'newevent'
    });
  },


  /*
   * GET /events/:id
   * loads an event by id
   */
  getEvent: function (req, res, next) {
    let slug = req.params.slug;
    let event = new nodeEvent({slug: slug});
    let settings = App.getConfig('events');

    event.fetch()
    .then(function (event) {
      res.render('events/event', {
        config: settings,
        title: event.get('title'),
        parseDate: event.parseDate(),
        parseTime: event.parseTime(),
        myEvent: event.toJSON(),
        description: event.get('title'),
        page: 'events'
      });

      return event.viewed();
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error.message});
      next(error);
    });
  },



  /*
   * GET /events/edit/:id
   */
  getEdit: function (req, res) {
    let event = new nodeEvent({id: req.params.id});

    event.fetch()
    .then(function (model) {
      res.render('events/edit', {
        page: 'eventedit',
        title: 'Event edit',
        description: 'MeeEvent edit',
        event: model.toJSON()
      });
    })
    .catch(function () {
      req.flash('errors', {'msg': 'Event not found.'});
      res.redirect('/admin/events');
    });
  },



  /**
   * GET /events
   * get upcoming events
   */
  getEvents: function (req, res, next) {
    let events = new Events();

    res.locals._page = 'events';

    let page = parseInt(req.query.p, 10);
    let query = {};
    let currentpage = page || 1;
    let limit = 2;
    let month = req.query.month || '';
    let monthObj;

    query.limit = limit;
    query.month = month;

    if (currentpage < 1) {
      res.redirect('/events');
    }

    let fetchQuery = {
      limit: limit,
      order: 'desc',
      page: currentpage
    };

    events.fetchBy('dt', fetchQuery, {
      columns: ['slug', 'title', 'url', 'city', 'short_desc', 'dt', 'start_time', 'address']
    })
    .then(function (collection) {
      res.render('events/events', {
        title: 'Node.js events in South Africa',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in South Africa',
        page: 'events'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');
    });
  },



  /**
   * GET /events/city/:city
   * get upcoming events
   */
  getEventsByCity: function (req, res, next) {
    let events = new Events();

    let page = parseInt(req.query.p, 10);
    let query = {};
    let currentpage = page || 1;
    let limit = 2;
    let city = req.params.city || '';
    let month = req.query.month || '';
    let monthObj;

    query.limit = limit;
    query.month = month;

    if (currentpage < 1) {
      res.redirect('/events');
    }

    let fetchQuery = {
      limit: limit,
      order: 'asc',
      page: currentpage,
      where: ['city', '=', city],
      base: '/events/city/' + city
    };

    if(month) {
      monthObj = events.parseMonth(month.trim());

      fetchQuery.where = ['dt', '>', monthObj.firstday];
      fetchQuery.andWhere = ['dt', '<', monthObj.lastday];
    }

    events.fetchBy('dt', fetchQuery, {
      columns: ['slug', 'title', 'url', 'city', 'desc', 'dt', 'start_time', 'address']
    })
    .then(function (collection) {
      res.render('events/events', {
        title: 'Events',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in ' + city,
        page: 'events'
      });
    })
    .catch(function (error) {
      req.flash('errors', {'msg': 'Database error. Could not fetch events.'});
      res.redirect('/');
    });
  },


  /**
   * GET /events
   * get events admin
   */
  getAdmin: function (req, res, next) {
    let events = new Events();

    let page = parseInt(req.query.p, 10);
    let query = {};
    let currentpage = page || 1;
    let limit = 10;
    let opts = {
      limit: limit,
      order: 'desc',
      page: currentpage,
      where: ['user_id', '=', req.user.get('id')],
      base: '/admin/events'
    };


    if (currentpage < 1) {
      res.redirect('/admin/events');
    }

    if (req.user.related('role').get('name') === 'Super Administrator') {
      opts.where = null;
    }

    events.fetchBy('dt', opts)
    .then(function (collection) {
      res.render('events/admin', {
        title: 'Events',
        pagination: events.pages,
        myEvents: collection.toJSON(),
        query: query,
        description: 'Find all upcoming Node.js events in South Africa',
        page: 'adminevents'
      });
    })
    .catch(function () {
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
    req.assert('markdown', 'Full description must be at least 12 characters long').len(12);
    req.assert('date', 'Date cannot be blank').notEmpty();
    req.assert('start_time', 'Starting cannot be blank').notEmpty();
    req.assert('email', 'Starting cannot be blank').isEmail();

    let errors = req.validationErrors();
    let eventData = {};
    let cleanDate = (req.body.date).split('/').join(' ');

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/events/new');
    }

    eventData.user_id = req.user.get('id');
    eventData.title = req.body.title;
    eventData.short_desc = req.body.short_desc;
    eventData.markdown = req.body.markdown;
    eventData.dt = moment(cleanDate, 'MM DD YYYY').format('YYYY-MM-DD');
    eventData.start_time = moment(req.body.start_time, 'h:mm A').format('HH:mm:ss');

    if(req.body.finish_time) {
      eventData.finish_time = moment(req.body.finish_time, 'h:mm A').format('HH:mm:ss');
    }
    else {
      eventData.finish_time = null;
    }

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

    let event = new nodeEvent(eventData);

    event.save(null, {
      context: {
        user_id: req.user.get('id')
      }
    })
    .then(function (model) {
      req.flash('success', { msg: 'Event successfully created!' });
      res.redirect('back');
    })
    .catch(function (error) {
      console.error(error.stack);
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
    req.assert('markdown', 'Full description must be at least 12 characters long').len(12);
    req.assert('date', 'Date cannot be blank').notEmpty();
    req.assert('start_time', 'Starting cannot be blank').notEmpty();
    req.assert('email', 'Starting cannot be blank').isEmail();

    let errors = req.validationErrors();
    let eventData = {};
    let user = req.user;
    let cleanDate = (req.body.date).split('/').join(' ');

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    eventData.id = req.body.event_id;
    eventData.title = req.body.title;
    eventData.short_desc = req.body.short_desc;
    eventData.markdown = req.body.markdown;
    eventData.dt = moment(cleanDate, 'MM DD YYYY').format('YYYY-MM-DD');
    eventData.start_time = moment(req.body.start_time, 'h:mm A').format('HH:mm:ss');

    if(req.body.finish_time) {
      eventData.finish_time = moment(req.body.finish_time, 'h:mm A').format('HH:mm:ss');
    }
    else {
      eventData.finish_time = null;
    }

    eventData.province = req.body.administrative_area_level_1 || '';
    eventData.city = req.body.locality || '';
    eventData.town = req.body.sublocality || '';
    eventData.address = req.body.formatted_address || req.body.geocomplete || '';
    eventData.website = req.body.webpage;
    eventData.url = req.body.url;
    eventData.lng = req.body.lng;
    eventData.lat = req.body.lat;
    eventData.email = req.body.email;
    eventData.number = req.body.number;

    let event = new nodeEvent({id: eventData.id});

    event.fetch()
    .then(function (model) {
      model.save(eventData, {method: 'update'})
      .then(function () {
        req.flash('success', { msg: 'Event successfully updated!' });
        res.redirect('back');
      })
      .catch(function (error) {
        req.flash('errors', {'msg': 'Restricted access, event not updated.'});
        res.redirect('back');
      });
    });
  },



  /**
   * GET /blog/delete
   * delete event
  **/
  getDelete: function(req, res) {
    let event = new nodeEvent({id: req.params.id});

    event.fetch()
    .then(function (event) {
      event.destroy()
      .then(function () {
        req.flash('success', {msg: 'Event successfully deleted.'});
        res.redirect('back');
      })
      .catch(function () {
        req.flash('error', {msg: 'Restricted access, event not deleted.'});
        res.redirect('back');
      });
    })
    .catch(function () {
      req.flash('error', {msg: 'Event not found'});
      res.redirect('back');
    });
  }
});

module.exports = App.addController('Events', EventsController);
