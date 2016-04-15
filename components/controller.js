
var App = require('cms');

Users = App.Controller.extend({

  getProfile: function (req, res) {
    let profile;
    let User = this.getModel('User');

    User.forge({slug: req.params.slug})
    .fetch({withRelated: ['posts', 'events']})
    .then(function (user) {
      profile = user;

      if (user.twitterHandle()) {
        return twitter.getTweets(user.twitterHandle());
      }
      else {
        return false;
      }
    })
    .then(function (tweets) {

      res.render('users/profile', {
        title: 'NodeZA profile of ' + profile.get('name'),
        myposts: profile.related('posts').toJSON(),
        myevents: profile.related('events').toJSON(),
        description: 'NodeZA profile of ' + profile.get('name'),
        profile: profile.toJSON(),
        page: 'profile',
        tweets: tweets || []
      });

      profile.viewed();
    })
    .catch(function (error) {
      req.flash('errors', {'msg': error[0].message});
      res.redirect('back');
    });
  },


  get: function (req, res) {
    this.getMode(modelname)
    this.getMode(modelname)
  },

  post: function (req, res) {
    this.getMode(modelname)
    this.getMode(modelname)
  },

  put: function (req, res) {
    this.getMode(modelname)
    this.getMode(modelname)
  },
});


module.exports = App.addController('Users', Users);
