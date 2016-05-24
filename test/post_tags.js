"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const Post = app.getModel('Post');
let postID;



function blogData() {
  let introPost = 'NodeZA, pronounced as Node Z A, is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js developers under one roof and promote Node as a technology.\n';
  introPost += 'NodeZA is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js deveoplers under one roof and promote Node as a technology.';

  let data = {
    title: 'Welcome to My Country',
    category_id: 1,
    user_id: 1,
    views: 0,
    meta_description: 'NodeZA is a community',
    markdown: introPost,
    published: true,
    featured: false
  };

  return data;
}


describe('Post', function(){

  let data = blogData();



  describe('#set #save', function() {
    it('should create a new post', function(done){
      let post = new Post();

      post.save(data, {updateTags: [{name: 'qawe'},{name: 'test'}]})
      .then(function (model) {
        postID = model.get('id');
        postID.should.above(0);
        model.get('meta_description').should.equal('NodeZA is a community');
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });


  describe('#tags #category #created_by', function() {
    it('should load tags associated this this post', function(done){
      Post.forge({id: postID})
      .fetch({withRelated: ['category', 'created_by', 'tags']})
      .then(function (post) {
        let category = post.related('category').toJSON();
        let created_by = post.related('created_by').toJSON();

        created_by.id.should.be.equal(1);
        category.id.should.be.equal(1);

        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });


  describe('#destroy', function() {
    let post;

    beforeEach(function (done) {
      let posts = new Post({id: postID});

      posts.fetch({withRelated: ['tags']})
      .then(function (model) {
        post = model;
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });

    it('should destroy post with related tags', function(done){
      post.related('tags')
      .detach()
      .then(function () {
        post.destroy()
        .then(function() {
          done();
        })
        .catch(function (error) {
          done(error);
        });
      })
      .catch(function (error) {
        done(error);
      });
    });
  });
});
