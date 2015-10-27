
var should = require('chai').should();
var FeaturedPosts = require('../widgets/featuredposts');
var App = require('../app');


describe('Featured Posts Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Posts collection', function(done){

      FeaturedPosts.exec(App)
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
