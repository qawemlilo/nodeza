"use strict";

const request = require('supertest');
const app = require('widget-cms');
const _ = require('lodash');
const path = require('path');
const config = require('../config');


describe('Routes', function(){
  let server;

  before(function (done) {
    app.config(_.defaults({

      port: 3003,

      secret: config.site.sessionSecret,

      db: config.db['test'],

      cache: false,

      redis: {expire: 60 * 60 * 5},

      log: true,

      rootDir: process.cwd(),

      uploadsDir: path.join(process.cwd(), 'public', 'uploads'),

      middleware: {
        enableForms: true,
        enableCSRF: false,
        inputValidation: true,
        enableSessions: true
      }
    }, config));

    app.start();

    done();
  });


  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/random-url')
        .expect(404, done);
    });
  });



  describe('GET /login', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/login')
        .expect(200, done);
    });
  });


  describe('GET /forgot', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/forgot')
        .expect(200, done);
    });
  });


  describe('GET /signup', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/signup')
        .expect(200, done);
    });
  });


  describe('GET /admin/account', function() {
    it('should redirect to login and return 302', function(done) {
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
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
      request(app)
        .get('/admin/users/roles')
        .expect('Location', '/')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });

});
