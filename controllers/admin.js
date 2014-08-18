
var App = require('../app');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var secrets = require('../config/secrets.json');




function updateConfig(configs) {

  var filepath = path.resolve(__dirname, '../config/secrets.json');

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
      page: 'accountconfig'
    });
  },


  getGlobalConfig: function (req, res) {
    res.render('admin/config', {
      title: 'Global Config',
      description: 'Global Config',
      page: 'getGlobalConfig',
      google: App.getConfig('google'),
      twitter: App.getConfig('twitter'),
      github: App.getConfig('github')
    });
  },


  getServerConfig: function (req, res) {
    var mysql = {
      db: App.getConfig('db'),
      user: App.getConfig('user'),
      host: App.getConfig('host'),
      password: App.getConfig('password'),
      charset: App.getConfig('charset'),
    };

    res.render('admin/config_server', {
      title: 'Global Config',
      description: 'Global Config',
      page: 'getGlobalConfig',
      mysql: mysql,
      mongodb: App.getConfig('mongodb')
    });
  },


  postConfig: function (req, res) {
    var config = req.body.id;
    var configs = {};

    if (req.body.passReqToCallback) {
      if(req.body.passReqToCallback === "yes") {
        req.body.passReqToCallback = true;
      }
      else {
        req.body.passReqToCallback = false;
      }
    }

    configs[config] = _.omit(req.body, ['id', '_csrf']);

    updateConfig(configs);

    req.flash('success', {'msg': 'Updated successfully'});
    res.redirect('back');
  }
};


module.exports = App.controller('Admin', AdminController);
