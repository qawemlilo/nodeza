
var should = require('chai').should();
var LatestPosts = require('../widgets/latestposts');
var App = require('../app');



describe('Latest Posts Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Latest Posts collection', function(done){

      LatestPosts.exec(App)
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
