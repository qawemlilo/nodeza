"use strict";

/**
 * Base Class for collections
**/

var when = require('when');
var Bookshelf  = require('../app').Bookshelf;


Bookshelf.Collection = Bookshelf.Collection.extend({

  limit: 10,

  total: 0,

  currentpage: 1,

  pages: {},

  base: '',

  paginationLimit: 10,

  whereQuery: [],

  andWhereQuery: [],

  order: 'desc',


  Cache: {},


  /**
   * Creates pagination data
   *
   * @returns: {Promise} - resolves with pagination
  */
  getData: function (totalRecords) {
    var self = this;
    var CURRENTPAGE = self.currentpage;
    var totalpages = Math.ceil(totalRecords / self.limit);
    var groups = Math.ceil(totalpages / self.paginationLimit);
    var pages = [];
    var highestF = CURRENTPAGE + 2;
    var lowestF = CURRENTPAGE - 2;
    var COUNTERLIMIT = totalpages - 2;
    var page;

    // we have groups of pagination
    if (groups > 1) {
      pages.push(1);
      pages.push(2);

      // if our current page is higher than 3
      if (lowestF > 3) {
        pages.push('...');

        //lets check if we our current page is towards the end
        if (totalpages - CURRENTPAGE < 2) {
          lowestF -=  3; // add more previous links
        }
      }
      else {
        lowestF = 3; // lowest num to start looping from
      }

      for (page = lowestF; page < lowestF + 5; page++) {
        if (page > COUNTERLIMIT) break;

        pages.push(page);
      }

      // if current page not towards the end
      if (highestF < COUNTERLIMIT) pages.push('...');

      pages.push(totalpages - 1);
      pages.push(totalpages);
    }
    else {
      // no complex pagination required
      for (page = 1; page <= totalpages; page++) {
        pages.push(page);
      }
    }

    self.pages = {
      base: self.base,
      items: pages,
      currentpage: CURRENTPAGE,
      isFirstPage: (CURRENTPAGE === 1),
      isLastPage: (CURRENTPAGE === totalpages),
      next: (CURRENTPAGE + 1),
      prev: (CURRENTPAGE - 1),
      total: totalRecords,
      limit: self.limit
    };

    return self.pages;
  },


  /**
   * Creates pagination data
   *
   * @returns: {Promiscollectione} - resolves with pagination
  */
  paginate: function () {
    var self = this;
    var query = self.model.forge().query();
    var totalpages = 0;

    if (self.whereQuery.length) {
      query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
    }

    if (self.andWhereQuery.length) {
      query.andWhere(self.andWhereQuery[0], self.andWhereQuery[1], self.andWhereQuery[2]);
    }

    return query.count('id AS total')
    .then(function (results) {
      totalpages = results[0].total;

      self.getData(totalpages);

      return totalpages;
    });
  },


  /**
   * fetches posts and orders them by {sortColumn}
   * @returns: {Promise} - resolves with Collection
  */
  fetchBy: function (sortColumn, options, fetchOptions) {

    options = options || {};
    fetchOptions = fetchOptions || {};

    var self = this;
    var limit = parseInt(options.limit, 10) || self.limit;
    var currentpage = parseInt(options.page, 10) || self.currentpage;
    var order = options.order || self.order;
    var whereQuery = options.where || self.whereQuery;
    var andWhereQuery = options.andWhere || self.andWhereQuery;
    var posts = self.constructor.forge();

    /*
     *  Let's make sure the filters are available for pagination
    **/
    self.currentpage = currentpage;
    self.whereQuery = whereQuery;
    self.andWhereQuery = andWhereQuery;
    self.limit = limit;
    self.order = order;
    self.base = options.base || self.base;

    function fetch() {
      return posts.query(function (query) {
        query.limit(limit);

        if (whereQuery.length) {
          query.where(whereQuery[0], whereQuery[1], whereQuery[2]);
        }

        if (andWhereQuery.length) {
          query.andWhere(andWhereQuery[0], andWhereQuery[1], andWhereQuery[2]);
        }

        query.offset((currentpage - 1) * limit);
        query.orderBy(sortColumn, order);
      })
      .fetch(fetchOptions)
      .then(function (collection) {
        return collection;
      });
    }

    if (options.noPagination) {
      return fetch();
    }
    else {
      return self.paginate().then(fetch);
    }
  }
});


module.exports = Bookshelf;
