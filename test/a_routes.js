
var request = require('supertest');
var app = require('../app');
var user = require('../models/user');


describe('Routes', function(){
  var server;

  before(function (done) {
    app.init(3002, function () {
      server = app.server;

      user.forge({id: 1})
      .fetch({withRelated: ['role', 'tokens']})
      .then(function (model) {
        app.user = model;
        done();
      });
    });
  });


  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      request(server)
        .get('/random-url')
        .expect(404, done);
    });
  });



  describe('GET /login', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/login')
        .expect(200, done);
    });
  });


  describe('GET /forgot', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/forgot')
        .expect(200, done);
    });
  });


  describe('GET /signup', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/signup')
        .expect(200, done);
    });
  });


  describe('GET /devs/:slug', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/devs/' + app.user.get('slug'))
        .expect(200, done);
    });
  });


  describe('GET /admin/account', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/account')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/events', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/events')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/meetups', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/meetups')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/blog', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/blog')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/account/password', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/account/password')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/account/linked', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/account/linked')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/blog/categories', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/blog/categories')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/users', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/users')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/users/roles', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/users/roles')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/links', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/links')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/routes', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/routes')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /admin/menus', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/admin/menus')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('GET /events', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/events')
        .expect(200, done);
    });
  });

  describe('GET /blog', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/blog')
        .expect(200, done);
    });
  });


  describe('GET /meetups', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/meetups')
        .expect(200, done);
    });
  });

  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });
});
