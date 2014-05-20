/**
 * Module dependencies.
 */

var MySql  = require('bookshelf').PG;
var Event = require('../models/event');
var async = require('async');

function datetime(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = MySql.Collection.extend({

  model: Event,


  limit: 5,
  

  total: 0,


  currentpage: 1,


  base: '/events',

  
  paginationLimit: 10,


  sortby: 'dt',


  sortorder: 'asc',

  
  paginate: function (total) {

    var pages = Math.ceil(total / this.limit);
    var groups = Math.ceil(pages / this.paginationLimit);
    var currentpage = this.currentpage; 
    var items = [];
    var prev = currentpage - 1;
    var next = currentpage + 1;
    var isFirstPage = currentpage === 1;
    var lastpage = pages;
    var isLastPage = currentpage === lastpage;
    var highestF = currentpage + 2;
    var lowestF = currentpage - 2;
    var counterLimit = pages - 2; // last nu


    if (groups > 1) {
      items.push(1);
      items.push(2);

      if (lowestF > 3) {
        items.push('...');

        if (lastpage - currentpage < 2) {
           lowestF -=  3;        
        }
      }
      else {
        lowestF = 3;
      }

      for (var counter = lowestF; counter < lowestF + 5; counter++) {
        if (counter > counterLimit) break;

        items.push(counter);
      }

      if (highestF < pages - 2) {
        items.push('...');
      }

      items.push(lastpage - 1);
      items.push(lastpage);
    }
    else {
      for (var counter2 = 1; counter2 <= lastpage; counter2++) {
        items.push(counter2);
      }
    }


    return {
      items: items,
      currentpage: currentpage,
      base: this.base,
      isFirstPage: isFirstPage,
      isLastPage: isLastPage,
      next: next,
      prev: prev
    };
  },


  

  fetchItems: function (success, error) {
    var self = this;

    async.waterfall([
      function(done) {
        self.model.forge()
        .query()
        .count('id AS total')
        .then(function (results) {
          done(false, self.paginate(results[0].total));
        })
        .otherwise(function () {
          done(true);
        });
      },
      
      function(pagination, done) {
        var query = self.query();
    
        query.limit(self.limit)
         .offset((self.currentpage - 1) * self.limit)
         .orderBy(self.sortby, self.sortorder)
         .where('dt', '>', datetime())
         .select()
         .then(function (models) {
            self.reset(models);
            success(self.models, pagination);
         })
         .otherwise(function (models) {
            done(true);
         });
      }, 

      function(err) {
        if (err) {
          return error();
        }
      }
    ]);
  }
});
