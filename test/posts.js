
var should = require('chai').should();
var Posts = require('../collections/posts');



describe('Posts', function(){

  describe('#fetchBy views', function() {
    it('should fetch posts and order by views', function(done){
      var posts = new Posts();

      posts.fetchBy('views', {
        limit: 4
      })
      .then(function (collection) {
        collection.length.should.be.equal(4);
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
        limit: 4
      })
      .then(function (collection) {
        collection.length.should.be.equal(4);
        collection.at(0).get('created_at').should.be.gt(collection.at(1).get('created_at'));
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