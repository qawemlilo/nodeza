"use strict";

const crypto = require('crypto');
const moment = require('moment');
const _ = require('lodash');


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


module.exports.setup = function (hbs) {

  hbs.registerHelper('eventLabel', function(dt, context) {
    let label = '';
    let isUpcoming = moment(dt) > moment();

    if (isUpcoming || moment(dt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      label = '<span class="label label-danger">upcoming</span>';
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




  hbs.registerHelper('richHTML', function(text, context) {
    let re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
    return text.replace(re, function(match, lParens, url) {
        let rParens = '';
        lParens = lParens || '';

        // Try to strip the same number of right parens from url
        // as there are left parens.  Here, lParenCounter must be
        // a RegExp object.  You cannot use a literal
        //     while (/\(/g.exec(lParens)) { ... }
        // because an object is needed to store the lastIndex state.
        let lParenCounter = /\(/g;
        while (lParenCounter.exec(lParens)) {
            let m;
            // We want m[1] to be greedy, unless a period precedes the
            // right parenthesis.  These tests cannot be simplified as
            //     /(.*)(\.?\).*)/.exec(url)
            // because if (.*) is greedy then \.? never gets a chance.
            if (m = /(.*)(\.\).*)/.exec(url) ||
                    /(.*)(\).*)/.exec(url)) {
                url = m[1];
                rParens = m[2] + rParens;
            }
        }
        return lParens + "<a target='_blank' href='" + url + "'>" + url + "</a>" + rParens;
    });
  });



  hbs.registerHelper('myTime', function(time, fmt, context) {
    let formatedTime = '';

    if (time && typeof fmt === 'string') {
      formatedTime = parseTime(time, fmt);
    }
    else if (time) {
      formatedTime = parseTime(time);
    }

    return formatedTime;
  });


  hbs.registerHelper('makeItJpg', function(url, context) {
    return url.replace(/png|gif|jpeg|JPG/gi, 'jpg');
  });


  hbs.registerHelper('copyright', function(url, context) {
    let year = (new Date()).getFullYear();

    return `&copy; 2014 - ${year} <span class="glyphicon glyphicon-fire text-danger"></span>`;
  });


  hbs.registerHelper('gravatar', function(email, size, context) {
    size = size || 32;

    if (!email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    let md5 = crypto.createHash('md5').update(email);

    return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=retro';
  });


  hbs.registerHelper('parseUrl', function(url, context) {
    if (url.indexOf('http') === -1) {
      url = 'http://' + url;
    }

    return url;
  });



  hbs.registerHelper('fillTags', function(tags, fmtcontext) {
    let names = _.map(tags, 'name');

    return names.join(',');
  });


  hbs.registerHelper('htmlToMarkdown', function(html, context) {
    let markdown = html.replace(/<br>/g, '\n');

    return markdown;
  });



  hbs.registerHelper('isPublished', function(flag, id, context) {
    let answer = parseInt(flag, 10);
    let link = '';

    if (answer === 1) {
      link = link = '<a href="/blog/publish/' + id +'" title="Published" class="text-success"><span class="glyphicon glyphicon-ok"></span></a>';
    }
    else {
      link = '<a href="/blog/publish/' + id +'" title="Draft" class="text-danger"><span class="glyphicon glyphicon-remove"></span></a>';
    }

    return link;
  });



  hbs.registerHelper('isFeatured', function(messages, context) {
    let answer = parseInt(flag, 10);
    let link = '';

    if (answer === 1) {
      link = link = '<a href="/blog/featured/' + id +'" title="Featured" class="text-success"><span class="glyphicon glyphicon-ok"></span></a>';
    }
    else {
      link = '<a href="/blog/featured/' + id +'" title="" class="text-danger"><span class="glyphicon glyphicon-remove"></span></a>';
    }

    return link;
  });



  hbs.registerHelper('lastMessage', function(messages, context) {
    let len = messages.length - 1;
    return messages[len].body.substring(0, 160) + '...';
  });


  hbs.registerHelper('lastMessageDate', function(messages, context) {
    let len = messages.length - 1;
    return parseDate(messages[len].created_at, 'HH:MM MMM D, YYYY');
  });


  hbs.registerHelper('countUnread', function(messages, userId, context) {
    let unread = messages.filter(function(msg) {
      return msg.read === 0 && msg.from_id !== userId;
    });

    if (unread.length) {
      return unread.length;
    }
    else {
      return '';
    }
  });


  hbs.registerHelper('activeMenu', function(page, val, fmtcontext) {
    page = page.toLowerCase();
    val = val.toLowerCase();

    let menus = {
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
        'menus',
        'password'
      ]
    };

    let flag = '';
    let matchingPages = menus[page];

    if (matchingPages.indexOf(val) > -1) {
      flag = 'active';
    }

    return flag;
  });



  hbs.registerHelper('activeAdminMenu', function(page, val, context) {
    page = page.toLowerCase();

    let menus = {
      account: ['changepassword', 'account', 'linkedaccounts'],
      events: ['adminevents'],
      meetups: ['adminmeetups'],
      blog: ['adminblog'],
      users: ['users', 'userroles'],
      menus: ['menus'],
      links: ['links'],
      routes: ['routes'],
      globalconfig: ['globalconfig', 'serverconfig', 'accountconfig'],
      password: ['password']
    };
    let flag = '';
    let matchingPages = menus[page];

    if (matchingPages && matchingPages.indexOf(val) > -1 || page === val) {
      flag = 'disabled';
    }

    return flag;
  });



  hbs.registerHelper('parseDate', function(dt, fmt, context) {
    return parseDate(dt, fmt);
  });



  hbs.registerHelper('caret', function(sort, order, val, context) {
    let caret = '';

    if (sort === val && order === 'asc') {
      caret = '<span class="caret"></span>';
    }
    else if (sort === val && order === 'desc') {
      caret = '<span class="caret" style="border-top:0; border-bottom:4px solid"></span>';
    }

    return caret;
  });



  hbs.registerHelper('list', function(items, pageOrAthour, options) {

    let templates ='';
    let template = '';
    let i;
    let collection;
    let model;
    let context = {};

    context.user = options.data.user;
    context._csrf = options.data._csrf;

    if (_.isObject(pageOrAthour)) {
      context.author = pageOrAthour;
    }
    else {
      context.page = pageOrAthour;
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


  hbs.registerHelper('paginator', function(pagination, context) {
    let lists = '';

    if (pagination.page === 1) {
      lists += `<li class="disabled"><a href="#">&laquo; Prev</a></li>`;
    }
    else {
      lists += `<li><a href="${pagination.base}?p=${pagination.page - 1}">&laquo; Prev</a></li>`;
    }

    for (var i = 1; i <= pagination.pageCount; i++) {
      lists += '<li ';

      if (i === pagination.page) {
        lists += 'class="active"';
      }

      lists += `><a href="${pagination.base}?p=${i}">${i}</a></li>`;
    }

    if (pagination.page === pagination.pageCount) {
      lists += `<li class="disabled"><a href="#">Next &raquo;</a></li>`;
    }
    else {
      lists += `<li><a href="${pagination.base}?p=${pagination.page + 1}">Next &raquo;</a></li>`;
    }

    return lists;
  });


  hbs.registerHelper('paginate', function(pagination, query, context) {
    let lists = '';

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
    let summary = '';
    let open = html.indexOf('<p>');
    let close = html.indexOf('</p>');

    summary = html.substring(open, close);

    return summary;
  });


  hbs.registerHelper('mainMenu', function(collection, currentPage, context) {
    let html = '';

    _.each(collection, function (model) {
      html += '<li ';
      if (currentPage === model.inner_text.replace(/ /g, '').toLowerCase()) {
        html += 'class="active"';
      }

      html += '><a href="' + model.route.path + '">';
      html += '<span class="glyphicon glyphicon-'+ model.icon +'"></span>';
      html += model.inner_text + '</a></li>';
    });

    return html;
  });

  hbs.registerHelper('selectedCat', function(cats, catid, context) {
    let html = '';

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
    let html = '';

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
    let html = '';

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
    let html = '';

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
    let html = '';

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
