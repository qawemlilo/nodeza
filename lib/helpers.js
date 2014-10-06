"use strict";

var moment = require('moment');
var _ = require('lodash');


module.exports.setup = function (hbs) {

  /**
   * parses date
  **/
  function parseDate(dt, fmt) {
    return moment(dt).format(fmt || 'ddd D MMM YYYY');
  }


  /**
   * parses time
  **/
  function parseTime(ts, fmt) {
    return moment(ts, 'HH:mm:ss').format(fmt || 'HH:mm');
  }




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



  hbs.registerHelper('eventLabel', function(dt, context) {
    var label = '<span class="label ';
    var cleandate = moment(dt).format('YYYY-MM-DD');
    var isUpcoming = moment(cleandate).unix() > moment().unix();

    if (isUpcoming) {
      label += 'label-danger">upcoming</span>';
    }
    else {
      label += 'label-default">archived</span>';
    }

    return label;
  });



  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
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



  hbs.registerHelper('myTime', function(time, fmt, context) {
    var formatedTime;

    if (typeof fmt === 'string') {
      formatedTime = parseTime(time, fmt);
    }
    else {
      formatedTime = parseTime(time);
    }

    return formatedTime;
  });


  hbs.registerHelper('fillTags', function(tags, fmtcontext) {
    var names = _.pluck(tags, 'name');

    return names.join(',');
  });


  hbs.registerHelper('htmlToMarkdown', function(html, context) {
    var markdown = html.replace(/<br>/g, '\n');

    return markdown;
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
    val = val.toLowerCase();

    var menus = {
      home: ['home', '/'],
      events: ['events', 'event'],
      login: ['login'],
      signup: ['signup', 'register', 'join'],
      blog: ['post', 'posts', 'blog'],
      meetups: ['meetups', 'meetup'],
      admin: [
        'changepassword', 
        'admin',
        'globalconfig',
        'serverconfig',
        'globalconfig',
        'users', 
        'userroles', 
        'postedit', 
        'newpost', 
        'adminmeetups', 
        'account', 
        'linkedaccounts', 
        'adminevents', 
        'adminblog',
        'routes',
        'links',
        'menus'
      ]
    };

    var flag = '';
    var matchingPages = menus[page];

    if (matchingPages.indexOf(val) > -1) {
      flag = 'active';
    }

    return flag;
  });



  hbs.registerHelper('activeAdminMenu', function(page, val, context) {
    page = page.toLowerCase();

    var menus = {
      account: ['changepassword', 'account', 'linkedaccounts'],
      events: ['adminevents'],
      meetups: ['adminmeetups'],
      blog: ['adminblog'],
      users: ['users', 'userroles'],
      menus: ['menus'],
      links: ['links'],
      routes: ['routes'],
      globalconfig: ['globalconfig', 'serverconfig', 'accountconfig']
    };
    var flag = '';
    var matchingPages = menus[page];

    if (matchingPages && matchingPages.indexOf(val) > -1) {
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
    else if (sort === val && order === 'desc') { 
      caret = '<span class="caret" style="border-top:0; border-bottom:4px solid"></span>';
    }

    return caret;
  });



  hbs.registerHelper('list', function(items, page, options) {

    var templates ='';
    var template = '';
    var i;
    var collection;
    var model;
    var context = {};

    context.user = options.data.user; 
    

    if (_.isObject(page)) {
      context.author = page;
    }
    else {
      context.page = page;
    }
    
    for (i=0; i<items.length; i++) {
        template = hbs.compile(items[i].template);

        context.config = items[i].config;
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

    return templates;
  });


  hbs.registerHelper('paginate', function(pagination, query, context) {
    var lists = '';

    if (pagination.isFirstPage) {
      lists += '<li class="disabled"><a href="#">&laquo; Prev</a></li>';
    } 
    else {
      lists += '<li><a href="' + pagination.base;

      if (query.month) {
        lists += '?month=' + query.month + '&'; 
      }
      else {
        lists += '?';
      }

      lists += 'p=' + pagination.prev + '">' + '&laquo; Prev</a></li>';
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

        lists += '><a href="' + pagination.base;
        
        if (query.month) {
          lists += '?month=' + query.month + '&';
        }
        else {
          lists += '?';
        }

        lists += 'p=' + page +'">' + page + '</a></li>';
      }
    });

    if (pagination.isLastPage) {
      lists += '<li class="disabled"><a href="#">Next &raquo;</a></li>';
    } else {
      lists += '<li><a href="' + pagination.base;
      
      if (query.month) {
        lists += '?month=' + query.month + '&';
      }
      else {
        lists += '?';
      }

      lists += 'p=' + pagination.next + '">' + 'Next &raquo;</a></li>';
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


  hbs.registerHelper('mainMenu', function(collection, currentPage, context) {
    var html = '';

    _.each(collection, function (model) {
      html += '<li ';
      if (currentPage === model.inner_text.toLowerCase()) {
        html += 'class="active"';
      }

      html += '><a href="' + model.route.path + '">';
      html += '<span class="glyphicon glyphicon-'+ model.icon +'"></span>';
      html += model.inner_text + '</a></li>';
    });

    return html;
  });

  hbs.registerHelper('selectedCat', function(cats, catid, context) {
    var html = '';

    cats.forEach(function (cat) {
      html += '<option value="';
      html += cat.id + '" ';
      if (cat.id === catid) {
        html += 'selected';
      }

      html += '>';
      html += cat.name;
      html += '</option>';
    });

    return html;
  });


  hbs.registerHelper('selectedRole', function(roles, roleid, context) {
    var html = '';

    roles.forEach(function (role) {
      html += '<option value="';
      html += role.id + '" ';
      if (role.id === roleid) {
        html += 'selected';
      }

      html += '>';
      html += role.name;
      html += '</option>';
    });

    return html;
  });


  hbs.registerHelper('selectedController', function(collection, activecontroller, context) {
    var html = '';

    collection.forEach(function (model) {
      html += '<option value="';
      html += model.name + '" ';
      if (model.name === activecontroller) {
        html += 'selected';
      }

      html += ' data-methods="' + model.methods + '"';

      html += '>';
      html += model.name;
      html += '</option>';
    });

    return html;
  });


  hbs.registerHelper('selectedDropdown', function(collection, activeId, context) {
    var html = '';

    collection.forEach(function (model) {
      html += '<option value="';
      html += model.id + '" ';
      if (model.id === activeId) {
        html += 'selected';
      }

      html += '>';
      html += model.name;
      html += '</option>';
    });

    return html;
  });


  hbs.registerHelper('selectedRoute', function(collection, activeId, context) {
    var html = '';

    collection.forEach(function (model) {
      html += '<option value="';
      html += model.id + '" ';
      if (model.id === activeId) {
        html += 'selected';
      }

      html += '>';
      html += model.path;
      html += '</option>';
    });

    return html;
  });
};
