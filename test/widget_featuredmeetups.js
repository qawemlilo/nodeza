
var should = require('chai').should();
var Collections = require('../collections');
var FeaturedMeetups = require('../widgets/featuredmeetups');
var App = require('../app');



describe('Featured Meetups Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Meetups collection', function(done){

      FeaturedMeetups.exec(App, Collections) 
      .then(function (widget) {
        widget.collection.length.should.above(0);
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});