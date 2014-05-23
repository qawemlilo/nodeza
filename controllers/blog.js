



module.exports = {
  
  /**
   * GET /blog
   * load blog page
   */
  getBlog: function (req, res) {
    res.render('blog', {
      title: 'Blog',
      loggedIn: !!req.user
    });
  }
};

