


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res, next) {

    var opts = {
      title: 'Welcome to NodeZA, a Node.js information portal for developers in South Africa',
      description: 'NodeZA is a platform that aims to make it easy to find information about Node.js, learn, and connect with other Node users in South Africa',
      page: 'home'
    };

    res.render('index', opts);
  }
};

