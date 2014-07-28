
var should = require('chai').should();
var Collections = require('../collections');
var LatestPosts = require('../widgets/latestposts');
var App = require('../app');



describe('Latest Posts Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Latest Posts collection', function(done){

      LatestPosts.exec(App, Collections) 
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