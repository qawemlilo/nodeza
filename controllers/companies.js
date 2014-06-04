



module.exports = {
  
  /**
   * GET /companies
   * load companies page
   */
  getCompanies: function (req, res) {
    res.render('companies', {
      title: 'Companies using Node.js in South Africa',
      description: 'Discover companies using Node.js in South Africa',
      page: 'companies'
    });
  }
};

