
var should = require('chai').should();
var Posts = require('../collections/posts');



describe('Posts', function(){

  describe('#fetchBy views', function() {
    it('should fetch posts and order by views', function(done){
      var posts = new Posts();

      posts.fetchBy('views', {
        limit: 2
      })
      .then(function (collection) {
        collection.length.should.be.equal(2);
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });

  describe('#fetchBy created_at', function() {
    it('should fetch posts and order by created_at', function(done){
      var posts = new Posts();

      posts.fetchBy('created_at', {
        limit: 2
      })
      .then(function (collection) {
        collection.length.should.be.equal(2);
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });

  describe('#featured', function() {
    it('should fetch featured posts', function(done){
      var posts = new Posts();

      posts.featured(1)
      .then(function (collection) {
        collection.length.should.be.equal(1);
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});