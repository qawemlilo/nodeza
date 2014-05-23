



module.exports = {

  /**
   * GET /meetups
   * load meetups page
   */
  getMeetups: function (req, res) {
    res.render('meetups', {
      title: 'Find Meetups',
      loggedIn: !!req.user
    });
  }
};

