var request = require('supertest');
var app = require('../app.js');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
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


describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});


describe('GET /accout', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/accout')
      .expect(404, done);
  });
});


/*
describe('POST /signup', function () {
  it('should redirect to /', function (done) {
    request(app)
    .post('/signup')
    .field('name', 'Test')
    .field('email', 'test@test.com')
    .field('password', 'pass11')
    .field('confirmPassword', 'pass11')
    .expect('Location', '/')
    .end(done);
  });

  after(function(done) {
    request(app)
    .get('/logout')
    .expect('Location', '/')
    .end(done);
  })
});

describe('POST /login', function () {
  it('should redirect to /', function (done) {
    request(app)
    .post('/login')
    .field('email', 'test@test.com')
    .field('password', 'pass11')
    .expect('Location','/')
    .end(done);
  })
});
*/
