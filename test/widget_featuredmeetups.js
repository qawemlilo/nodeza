
var should = require('chai').should();
var FeaturedMeetups = require('../widgets/featuredmeetups');
var App = require('../app');



describe('Featured Meetups Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Meetups collection', function(done){

      FeaturedMeetups.exec(App)
      .then(function (collection) {
        collection.length.should.above(0);
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });
});
