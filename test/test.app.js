var request = require('supertest');
var app = require('../app.js');
var cheerio = require('cheerio');
var when = require('when');


/*
function getCsrf(url) {
  
  var deferred = when.defer();
  
  request(app)
  .get('url')
  .end(function (res) {
    if(res) {

      $ = cheerio.load(res.body);
      _csrf = $('input[name=_csrf]').val();

      deferred.resolve(_csrf);
    }
    else {
      deferred.reject();
    } 
  });

  return deferred.promise;
}
*/


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
      .get('/random-url')
      .expect(404, done);
  });
});


describe('GET /account', function() {
  it('should redirect to login and return 302', function(done) {
    request(app)
      .get('/account')
      .expect('Location', '/login')
      .expect(302)
      .end(function(err, resp) {
        if (err) return done(err);
        done();
      });
  });
});


describe('GET /events', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/events')
      .expect(200, done);
  });
});

describe('GET /blog', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/blog')
      .expect(200, done);
  });
});


describe('GET /meetups', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/meetups')
      .expect(200, done);
  });
});


describe('GET /companies', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/companies')
      .expect(200, done);
  });
});