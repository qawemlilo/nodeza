


module.exports = {
  
  /**
   * GET /blog
   * load blog page
  **/
  getBlog: function (req, res) {
    res.render('blog', {
      title: 'Blog',
      description: 'Node.js related articles, tutorials and news',
      page: 'blog'
    });
  },



  /*
   * GET /admin/blog/new
   * load new event page
   */
  newPost: function (req, res) {
    res.render('newpost', {
      title: 'New Post',
      description: 'Create a new post',
      page: 'newpost'
    });
  },
};

