/**
 * Module dependencies.
**/
var MySql  = require('bookshelf').PG;
var Event = require('../models/event');
var when = require('when');


/**
 * Converts date in milliseconds to MySQL datetime format
 * @param: ts - date in milliseconds
 * @returns: MySQL datetime
 */
function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}


var Events = MySql.Collection.extend({

  model: Event,


  limit: 10,
  

  total: 0,


  currentpage: 1,


  paginated: {},


  base: '/events',


  whereQuery: ['dt', '>', datetime()],


  andWhereQuery: [],

  
  paginationLimit: 10,


  sortby: 'dt',


  order: 'asc',

 
  /**
   * Creates pagination data
   *
   * @returns: promise
  */ 
  paginate: function () {
    var self = this;
    var deferred = when.defer();
    var query = self.model.forge().query();

    if (self.whereQuery.length > 0) {
      query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
    }

    if (self.andWhereQuery.length > 0) {
      query.andWhere(self.andWhereQuery[0], self.andWhereQuery[1], self.andWhereQuery[2]);
    }

    query.count('id AS total')
    .then(function (results) {

      var total = results[0].total;
      var pages = Math.ceil(total / self.limit);
      var groups = Math.ceil(pages / self.paginationLimit);
      var currentpage = self.currentpage; 
      var items = [];
      var prev = currentpage - 1;
      var next = currentpage + 1;
      var isFirstPage = currentpage === 1;
      var lastpage = pages;
      var isLastPage = currentpage === lastpage;
      var highestF = currentpage + 2;
      var lowestF = currentpage - 2;
      var counterLimit = pages - 2; 


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
        if (highestF < pages - 2) {
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
      
      
      var paginated = {
        items: items,
        currentpage: currentpage,
        base: self.base,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        next: next,
        prev: prev,
        total: total,
        limit: self.limit
      };

      self.paginated = paginated;
      deferred.resolve(paginated);

    })
    .otherwise(function () {
      deferred.reject();
    });

    return deferred.promise;
  },


  
  /**
   * Fetches events by filtering options
   *
   * @param: success {Function} - accepts models and pagination data
   * @param: error {Function} - error callback
  */
  fetchItems: function () {
    var self = this;
    var deferred = when.defer();

    self.paginate()
    .then(function(pagination) {

      var query = self.query();

      query.limit(self.limit);
      query.offset((self.currentpage - 1) * self.limit);
      query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
      query.orderBy(self.sortby, self.order);

      query.select()
      .then(function (models) {
        self.reset(models);
        deferred.resolve(self);
      })
      .otherwise(function () {
        deferred.reject();
      });
    })
    .otherwise(function () {
      deferred.reject();
    });

    return deferred.promise;
  },


  
  /**
   * Fetches events by filtering options
   *
   * @param: success {Function} - accepts models and pagination data
   * @param: error {Function} - error callback
  */
  fetchMyEvents: function () {
    var self = this;
    var deferred = when.defer();

    self.paginate()
    .then(function(pagination) {

      var query = self.query();

      query.limit(self.limit);
      query.offset((self.currentpage - 1) * self.limit);

      if (self.whereQuery.length > 0) {
        query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
      }

      if (self.andWhereQuery.length > 0) {
        query.andWhere(self.andWhereQuery[0], self.andWhereQuery[1], self.andWhereQuery[2]);
      }
      
      query.orderBy(self.sortby, self.order);

      query.select()
      .then(function (models) {
        
        self.reset(models);

        deferred.resolve(self);
      })
      .otherwise(function () {
        deferred.reject();
      });
    })
    .otherwise(function () {
      deferred.reject();
    });

    return deferred.promise;
  }
});


module.exports = MySql.collection('Events', Events);
