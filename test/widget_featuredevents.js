
var should = require('chai').should();
var FeaturedEvents = require('../widgets/featuredevents');
var App = require('../app');



describe('Featured Events Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Events collection', function(done){

      FeaturedEvents.exec(App)
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
