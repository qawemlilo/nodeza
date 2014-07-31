
var should = require('chai').should();
var Tags = require('../widgets/tags');
var App = require('../app');



describe('Tags Widget', function(){

  describe('#exec', function() {
    it('should return widget props with tags collection', function(done){

      Tags.exec(App) 
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