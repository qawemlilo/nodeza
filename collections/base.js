/**
 * Base Class for collections
**/

var when = require('when');
var App  = require('../app');
var Bookshelf  = App.bookshelf;


Bookshelf.Collection = Bookshelf.Collection.extend({

  model: {},

  limit: 10,

  total: 0,

  currentpage: 1,

  pages: {},

  base: '',

  paginationLimit: 10,

  whereQuery: [],

  andWhereQuery: [],

  order: 'desc',

 
  /**
   * Creates pagination data
   *
   * @returns: {Promiscollectione} - resolves with pagination
  */ 
  makePages: function (totalRecords) {
    var self = this;
    var totalpages = Math.ceil(totalRecords / self.limit);
    var groups = Math.ceil(totalpages / self.paginationLimit);
    var currentpage = self.currentpage; 
    var items = [];
    var prev = currentpage - 1;
    var next = currentpage + 1;
    var isFirstPage = currentpage === 1;
    var lastpage = totalpages;
    var isLastPage = currentpage === lastpage;
    var highestF = currentpage + 2;
    var lowestF = currentpage - 2;
    var counterLimit = totalpages - 2; 


    if (groups > 1) {
      items.push(1);
      items.push(2);
      
      // if our current page is higher than 3
      if (lowestF > 3) {
        items.push('...');

        //lets check if we our current page is towards the end
        if (lastpage - currentpage < 2) {
           lowestF -=  3; // add more previous links       
        }
      }
      else {
        lowestF = 3; // lowest num to start looping from
      }

      for (var counter = lowestF; counter < lowestF + 5; counter++) {
        if (counter > counterLimit) break;

        items.push(counter);
      }
        
      // if current page not towards the end
      if (highestF < totalpages - 2) {
        items.push('...');
      }

      items.push(lastpage - 1);
      items.push(lastpage);
    }
    else {
      // no complex pagination required
      for (var counter2 = 1; counter2 <= lastpage; counter2++) {
        items.push(counter2);
      }
    }
      
      
    var pages = {
      items: items,
      currentpage: currentpage,
      base: self.base,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      next: next,
      prev: prev,
      total: totalRecords,
      limit: self.limit
    };
    
    self.pages = pages;

    return pages;
  },

 
  /**
   * Creates pagination data
   *
   * @returns: {Promiscollectione} - resolves with pagination
  */ 
  paginate: function () {
    var self = this;
    var deferred = when.defer();
    var query = self.model.forge().query();
    var totalpages = 0;

    if (self.whereQuery.length) {
      query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
    }  

    if (self.andWhereQuery.length) {
      query.andWhere(self.andWhereQuery[0], self.andWhereQuery[1], self.andWhereQuery[2]);
    }
    
    query.count('id AS total')
    .then(function (results) {
      totalpages = results[0].total;

      self.makePages(totalpages);

      deferred.resolve(totalpages);
    })
    .otherwise(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  
  /**
   * fetches posts and orders them by {sortColumn}
   * @returns: {Promise} - resolves with Collection
  */
  fetchBy: function (sortColumn, options, fetchOptions) {
    
    options = options || {};
    fetchOptions = fetchOptions || {};

    var self = this;
    var limit = options.limit || self.limit;
    var currentpage = options.page || self.currentpage;
    var order = options.order || self.order; 
    var whereQuery = options.where || self.whereQuery;
    var andWhereQuery = options.andWhere || self.andWhereQuery;
    var deferred = when.defer();

    /*
     *  Let's make sure the filters are available
     *  for pagination
    **/
    self.currentpage = currentpage;
    self.whereQuery = whereQuery;
    self.andWhereQuery = andWhereQuery;
    self.limit = limit;
    self.order = order;
    self.base = options.base || self.base;

    var posts = self.constructor.forge();
    
    function fetch() {
      posts.query(function (query) {
        query.limit(limit);
        query.where(whereQuery[0], whereQuery[1], whereQuery[2]);
        
        if (andWhereQuery.length) {
          query.andWhere(andWhereQuery[0], andWhereQuery[1], andWhereQuery[2]);
        }

        query.offset((currentpage - 1) * limit);
        query.orderBy(sortColumn, order);
      })
      .fetch(fetchOptions)
      .then(function (collection) {
        deferred.resolve(collection);
      })
      .otherwise(function (err) {
        deferred.reject(err);
      });
    }

    if (options.noPagination) {
      fetch();
    }
    else {
      self.paginate()
      .then(fetch)
      .otherwise(function (err) {
        deferred.reject(err);
      });
    }

    return deferred.promise;
  }
});


module.exports = Bookshelf;