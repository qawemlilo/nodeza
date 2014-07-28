
var should = require('chai').should();
var Collections = require('../collections');
var Categories = require('../widgets/categories');
var App = require('../app');



describe('Categories Widget', function(){

  describe('#exec', function() {
    it('should return widget props with categories collection', function(done){

      Categories.exec(App, Collections) 
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