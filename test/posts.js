"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const Posts = app.getCollection('Posts');
let postsData = require('../sql/data/posts');

describe('Posts', function(){

  let newposts;

  before(function (done) {
    let postsArr = [];

    postsData.forEach(function (item) {
      postsArr.push(item.data);
    });

    newposts = new Posts(postsArr);

    newposts.invokeThen('save').then(function() {
      done();
    }).
    catch(function (error) {
      done(error);
    });
  });

  describe('#fetchBy views', function() {
    it('should fetch posts and order by views', function(done){
      let posts = new Posts();

      posts.fetchBy('views', {
        limit: 2
      })
      .then(function (collection) {
        collection.length.should.be.equal(2);
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });

  describe('#fetchBy created_at', function() {
    it('should fetch posts and order by created_at', function(done){
      let posts = new Posts();

      posts.fetchBy('created_at', {
        limit: 2
      })
      .then(function (collection) {
        collection.length.should.be.equal(2);
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });

  describe('#fetchBy created_at', function() {
    it('should fetch posts and order by created_at', function(done){
      newposts.invokeThen('destroy').then(function() {
        done();
      }).
      catch(function (error) {
        done(error);
      });
    });
  });

});
