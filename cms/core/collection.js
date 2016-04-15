"use strict";

/**
 * Base Class for collections
**/

module.exports = function (Bookshelf) {

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
    makePages: function (totalRecords) {
      let CURRENTPAGE = this.currentpage;
      let totalpages = Math.ceil(totalRecords / this.limit);
      let groups = Math.ceil(totalpages / this.paginationLimit);
      let pages = [];
      let highestF = CURRENTPAGE + 2;
      let lowestF = CURRENTPAGE - 2;
      let COUNTERLIMIT = totalpages - 2;
      let page;

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

      this.pages = {
        base: this.base,
        items: pages,
        currentpage: CURRENTPAGE,
        isFirstPage: (CURRENTPAGE === 1),
        isLastPage: (CURRENTPAGE === totalpages),
        next: (CURRENTPAGE + 1),
        prev: (CURRENTPAGE - 1),
        total: totalRecords,
        limit: this.limit
      };

      return this.pages;
    },


    /**
     * Creates pagination data
     *
     * @returns: {Promiscollectione} - resolves with pagination
    */
    paginate: function () {

      let query = this.model.forge().query();
      let totalpages = 0;

      if (this.whereQuery.length) {
        query.where(this.whereQuery[0], this.whereQuery[1], this.whereQuery[2]);
      }

      if (this.andWhereQuery.length) {
        query.andWhere(this.andWhereQuery[0], this.andWhereQuery[1], this.andWhereQuery[2]);
      }

      return query.count('id AS total')
      .then((results) => {
        totalpages = results[0].total;

        this.makePages(totalpages);

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

      let limit = parseInt(options.limit, 10) || this.limit;
      let currentpage = parseInt(options.page, 10) || this.currentpage;
      let order = options.order || this.order;
      let whereQuery = options.where || this.whereQuery;
      let andWhereQuery = options.andWhere || this.andWhereQuery;
      let posts = this.constructor.forge();

      /*
       *  Let's make sure the filters are available for pagination
      **/
      this.currentpage = currentpage;
      this.whereQuery = whereQuery;
      this.andWhereQuery = andWhereQuery;
      this.limit = limit;
      this.order = order;
      this.base = options.base || this.base;

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
        return this.paginate().then(fetch);
      }
    }
  });

  return Bookshelf;
};
