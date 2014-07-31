
var should = require('chai').should();
var FeaturedEvents = require('../widgets/featuredevents');
var App = require('../app');



describe('Featured Events Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Events collection', function(done){

      FeaturedEvents.exec(App) 
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