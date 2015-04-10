

var _       = require('lodash');
var http    = require('http');
var xml     = require('xml');


// ToDo: Make this configurable
var pingList = [
  {host: 'blogsearch.google.com', path: '/ping/RPC2'},
  {host: 'rpc.pingomatic.com', path: '/'}
];


function ping(post) {
  var pingXML;
  var title = post.title;
  var url = 'http://nodeza/blog/' + post.slug;

  // Only ping when in production and not a page
  if (process.env.NODE_ENV !== 'production') {
    return;
  }


  // Build XML object.
  pingXML = xml({
    methodCall: [{
      methodName: 'weblogUpdate.ping'
    },
    {
      params: [{
        param: [{
          value: [{string: title}]
        }]
      },
      {
        param: [{
          value: [{string: url}]
        }]
      }]
    }]
  },
  {
    declaration: true
  });

  // Ping each of the defined services.
  _.each(pingList, function (pingHost) {
    var options = {
      hostname: pingHost.host,
      path: pingHost.path,
      method: 'POST'
    };
    var req;

    req = http.request(options);
    req.write(pingXML);
    req.on('error', function (error) {
      console.error(error.stack);
    });
    req.end();
  });
}



module.exports.ping = ping;
