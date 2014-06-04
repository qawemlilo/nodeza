



module.exports = {
  
  /**
   * GET /blog
   * load blog page
   */
  getBlog: function (req, res) {
    res.render('blog', {
      title: 'Blog',
      description: 'Node.js related articles, tutorials and news',
      page: 'blog'
    });
  }
};

