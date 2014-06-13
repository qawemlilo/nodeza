
var should = require('chai').should();
var Post = require('../models/post');
var postID;



function blogData() {
  var introPost = 'NodeZA, pronounced as Node Z A, is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js developers under one roof and promote Node as a technology.\n';
  introPost += 'NodeZA is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js deveoplers under one roof and promote Node as a technology.';

  var data = {
    title: 'Welcome to NodeZA',
    category_id: 1,
    user_id: 1,
    views: 0,
    meta_title: 'Welcome to NodeZA',
    meta_description: 'NodeZA is a community',
    markdown: introPost,
    published: 1,
    featured: 0
  };

  return data;
}


describe('Post', function(){

  var data = blogData();
  var post = new Post();


  describe('#set #save', function() {
    it('should create a new post', function(done){
      
      post.tags = 'junk';
      post.set(data);

      post.save()
      .then(function (model) {
        postID = model.get('id'); 
        postID.should.above(0);
        model.get('meta_description').should.equal('NodeZA is a community');
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });

 
  describe('#tags #category #created_by', function() {
    it('should load tags associated this this post', function(done){
      Post.forge({id: postID})
      .fetch({withRelated: ['tags', 'category', 'created_by']})
      .then(function (post) {
        var tags = post.related('tags').toJSON();
        var category = post.related('category').toJSON();
        var created_by = post.related('created_by').toJSON();

        tags.length.should.be.above(0);
        done();
      });
    });
  });

  describe('#destroy', function() {
    it('should destroy post with related tags', function(done){
      Post.forge({id: postID})
      .fetch({withRelated: ['tags']})
      .then(function(post) {
        return post.related('tags')
          .detach()
          .then(function () {
            return post.destroy();
          });
      })
      .then(function() {
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});