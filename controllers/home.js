


module.exports = {

  /**
   * Get /
   * load home page
  */
  index: function (req, res, next) {

    var opts = {
      title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
      description: 'NodeZA is a community of Node.js developers in South Africa',
      page: 'home'
    };

    res.render('index', opts);
  }
};

