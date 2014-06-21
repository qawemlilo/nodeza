

var moment = require('moment');
var _ = require('lodash');



/**
  * parses date
**/
function parseDate(dt, fmt) {
  return moment(dt).format(fmt || 'ddd MMM D YYYY');
}


/**
 * parses time
**/
function myTime(ts) {
  return moment(ts, 'HH:mm:ss').format('HH:mm');
}

module.exports.setup = function (hbs) {

  var blocks = {};
  var partials = hbs.handlebars.partials;

  hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
      
    if (!block) {
      block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
  });


  hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    
    return val;
  });


  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  


  hbs.registerHelper('include', function(name, context) {
    var template = partials[name];

    if (!template) {
      return console.error("Partial not loaded");
    }

    template = hbs.compile(template);

    return template(context);
  });



  hbs.registerHelper('myTime', function(time, fmtcontext) {
    return myTime(time);
  });


  hbs.registerHelper('fillTags', function(tags, fmtcontext) {
    var names = _.pluck(tags, 'name');

    return names.join(',');
  });



  hbs.registerHelper('isPublished', function(flag, id, context) {
    var answer = parseInt(flag, 10);
    var link = '';

    if (answer === 1) {
      link = link = '<a href="/blog/publish/' + id +'" title="Published" class="text-success"><span class="glyphicon glyphicon-ok"></span></a>';
    }
    else {
      link = '<a href="/blog/publish/' + id +'" title="Draft" class="text-danger"><span class="glyphicon glyphicon-remove"></span></a>';
    }

    return link;
  });



  hbs.registerHelper('activeMenu', function(page, val, fmtcontext) {
    page = page.toLowerCase();

    var menus = {
      home: ['home', '/'],
      events: ['events', 'event'],
      login: ['login'],
      signup: ['signup', 'register', 'join'],
      blog: ['post', 'posts', 'blog'],
      meetups: ['meetups', 'meetup'],
      admin: ['changepassword', 'postedit', 'newpost', 'adminmeetups', 'account', 'linkedaccounts', 'adminevents', 'adminblog']
    };

    var flag = '';
    var matchingPages = menus[page];

    if (matchingPages.indexOf(val) > -1) {
      flag = 'active';
    }

    return flag;
  });



  hbs.registerHelper('activeAdminMenu', function(page, val, fmtcontext) {
    page = page.toLowerCase();

    var menus = {
      account: ['changepassword', 'account', 'linkedaccounts'],
      events: ['adminevents'],
      meetups: ['adminmeetups'],
      blog: ['adminblog']
    };

    var flag = '';
    var matchingPages = menus[page];

    if (matchingPages.indexOf(val) > -1) {
      flag = 'disabled';
    }

    return flag;
  });



  hbs.registerHelper('parseDate', function(dt, fmt, context) {
    return parseDate(dt, fmt);
  });



  hbs.registerHelper('caret', function(sort, order, val, context) {
    var caret = '';
    
    if (sort === val && order === 'asc') {
      caret = '<span class="caret"></span>';
    } 
    else if (sort === val && order == 'desc') { 
      caret = '<span class="caret" style="border-top:0; border-bottom:4px solid"></span>';
    }

    return caret;
  });


  hbs.registerHelper('list', function(items, options) {

    var templates ='';
    var template = '';
    var i;
    var collection;
    var model;
    var context = {};

    for(i=0; i<items.length; i++) {
      template = partials[items[i].name];

      if (!template) {
        console.error("%s - Partial not loaded", items[i].name);    
      }
      else {
        template = hbs.compile(template);

        collection = items[i].collection;
        model = items[i].model;

        if (collection) {
          context.collection = collection.toJSON();
        }

        else if (model) {
          context.tags = model.related('tags').toJSON();
          context.author = model.related('created_by').toJSON();

          context.post = model.toJSON();      
        }

        templates += template(context);
      }
    }

    return templates;
  });


  hbs.registerHelper('paginate', function(pagination, query, context) {

    var lists = '';

    if (pagination.isFirstPage) {
      lists += '<li class="disabled"><a href="#">&laquo; Prev</a></li>';
    }
    else {
      lists += '<li>';
      lists += '<a href="' + pagination.base;
      lists += '?p=' + pagination.prev;

      if (query.sort) {
        lists += '&sortby=' + query.sort;
      }

      lists += '">' + '&laquo; Prev</a></li>';
    }


    pagination.items.forEach(function (page) {
      if (page === '...') {
        lists += '<li class="disabled"><a href="#">...</a></li>';
      }
      else {
        lists += '<li ';
        if (page === pagination.currentpage) {
          lists += 'class="active"';
        }
        lists += '>';
        lists += '<a href="' + pagination.base + '?p=' + page;

        if (query.sort) {
          lists += '&sortby=' + query.sort;
        }

        lists += '">' + page + '</a></li>';
      }
    });


    if (pagination.isLastPage) {
      lists += '<li class="disabled"><a href="#">Next &raquo;</a></li>';
    }
    else {
      lists += '<li>';
      lists += '<a href="' + pagination.base;
      lists += '?p=' + pagination.next;

      if (query.sort) {
        lists += '&sortby=' + query.sort;
      }

      lists += '">' + 'Next &raquo;</a></li>';
    }

    return lists;
  });


  hbs.registerHelper('htmlSummary', function(html, context) {
    var summary = '';
    var open = html.indexOf('<p>');
    var close = html.indexOf('</p>');

    summary = html.substring(open, close);

    return summary;
  });
};
