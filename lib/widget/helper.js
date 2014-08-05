

var _ = require('lodash');


function matchPaths(urlPath, widgetPath) {

  if (urlPath === widgetPath) {
    return true;
  }

  var urlArr = urlPath.split('/');
  var widgetArr = widgetPath.split('/');
  var isMatch = false;

  if (urlArr.length !== widgetArr.length) {
    return isMatch;
  }

  if (widgetArr[widgetArr.length - 1] === ':any') {
    widgetArr[widgetArr.length - 1] = urlArr[urlArr.length - 1];
  }

  return urlArr.join('') === widgetArr.join('');
}


function matchPages(pages, page) {
  if(pages.length === 0 || pages.indexOf(page) > -1) {
    return true;
  }

  var isMatch = false, i;

  for (i = 0; i < pages.length; i++) {
    isMatch = matchPaths(page, pages[i]);
    
    if (isMatch) break;
  }

  return isMatch;
}


function sortCollection (widgetCollection, sortKey) {
  var widgetPositions = _.keys(widgetCollection);

  _.each(widgetPositions, function (key) {
    // lets sort widgets occupying the same panel
    widgetCollection[key].sort(function (obj1, obj2) {
      return obj1[sortKey] - obj2[sortKey];
    });
  });

  return widgetCollection;
}


module.exports.sortCollection = sortCollection;
module.exports.pagesMatch = matchPages;