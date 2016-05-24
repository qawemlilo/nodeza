"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const Menu = app.getModel('Menu');


describe('Menu', function(){

  describe('#forge #save', function() {
    it('should create a new menu item', function(done){
      Menu.forge({
        name: 'Test',
        description: 'Testing',
        role_id: 1
      })
      .save()
      .then(function(model) {
        model.get('name').should.equal('Test');
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });

  describe('#destroy', function() {
    let menu;

    beforeEach(function (done) {
      Menu.forge({name: 'Test'})
      .fetch()
      .then(function (model) {
        menu = model;
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });

    it('should destroy created menu', function(done){
      menu.destroy()
      .then(function() {
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });
});
