"use strict";



module.exports = {
  
  /**
   * GET /companies
   * load companies page
  **/
  getCompanies: function (req, res) {
    res.render('companies/companies', {
      title: 'Companies using Node.js in South Africa',
      description: 'Discover companies using Node.js in South Africa',
      page: 'companies'
    });
  }
};

