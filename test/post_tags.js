
var should = require('chai').should();
var Post = require('../models/post');
var postID;



function blogData() {
  var introPost = 'NodeZA, pronounced as Node Z A, is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js developers under one roof and promote Node as a technology.\n';
  introPost += 'NodeZA is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js deveoplers under one roof and promote Node as a technology.';

  var data = {
    title: 'Welcome to My Country',
    category_id: 1,
    user_id: 1,
    views: 0,
    meta_title: 'Welcome to NodeZA',
    meta_description: 'NodeZA is a community',
    markdown: introPost,
    published: true,
    featured: false
  };

  return data;
}


describe('Post', function(){

  var data = blogData();
  


  describe('#set #save', function() {
    it('should create a new post', function(done){
      var post = new Post();

      post.save(data, {updateTags: [{name: 'qawe'},{name: 'test'}]})
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
      .fetch({withRelated: ['category', 'created_by', 'tags']})
      .then(function (post) {
        var category = post.related('category').toJSON();
        var created_by = post.related('created_by').toJSON();

        created_by.id.should.be.equal(1);
        category.id.should.be.equal(1);

        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#destroy', function() {
    var posts;

    beforeEach(function () {
      posts = Post.forge({id: postID})
      .fetch({withRelated: ['tags']});

      return posts;
    });
    
    it('should destroy post with related tags', function(done){
      posts.then(function(post) {

        post.related('tags').length.should.be.equal(2);
        
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