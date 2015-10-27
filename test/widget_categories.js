
var should = require('chai').should();
var Categories = require('../widgets/categories');
var App = require('../app');



describe('Categories Widget', function(){

  describe('#exec', function() {
    it('should return widget props with categories collection', function(done){

      Categories.exec(App)
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
