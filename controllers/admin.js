"use strict";

var App = require('../app');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var secrets = require('../config/config.json');




function updateConfig(configs) {

  var filepath = path.resolve(__dirname, '../config/config.json');

  _.each(configs, function (val, key) {
    if(secrets[key]) {
      App.updateConfig(key, val);
      secrets[key] = val;
    }
  });

  var data = JSON.stringify(secrets, null, 4);

  fs.writeFile(filepath, data, 'utf8', function (error) {
    if(error) {
      return console.log(error.message);
    }

    console.log('Config file updated');
  });
}


var AdminController = {


  getAdmin: function (req, res) {
    res.render('admin/admin', {
      title: 'NodeZA Admin',
      description: 'NodeZA Admin',
      page: 'admin'
    });
  },


  getGlobalConfig: function (req, res) {
    res.render('admin/config', {
      title: 'Global Config',
      description: 'Global Config',
      site: App.getConfig('site'),
      page: 'globalconfig'
    });
  },


  getServerConfig: function (req, res) {
    res.render('admin/config_server', {
      title: 'Global Config',
      description: 'Global Config',
      mysql: App.getConfig('mysql'),
      mongodb: App.getConfig('mongodb'),
      page: 'serverconfig'
    });
  },


  getAccountConfig: function (req, res) {
    res.render('admin/config_account', {
      title: 'Account Config',
      description: 'Account Config',
      page: 'globalconfig',
      google: App.getConfig('google'),
      twitter: App.getConfig('twitter'),
      github: App.getConfig('github')
    });
  },


  postConfig: function (req, res) {
    var config = req.body.id;
    var configs = {};

    _.each(req.body, function(val, key) {
      if(req.body[key] === "yes") {
        req.body[key] = true;
      }
      if(req.body[key] === "no") {
        req.body[key] = false;
      }
    });

    var update = _.omit(req.body, ['id', '_csrf']);

    configs[config] = _.extend(App.getConfig(config), update);

    updateConfig(configs);

    req.flash('success', {'msg': 'Updated successfully'});
    res.redirect('back');
  }
};


module.exports = App.controller('Admin', AdminController);
