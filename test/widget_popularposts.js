
var should = require('chai').should();
var PopularPosts = require('../widgets/popularposts');
var App = require('../app');



describe('Popular Posts Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Popular Posts collection', function(done){

      PopularPosts.exec(App) 
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