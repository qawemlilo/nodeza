"use strict";

const _ = require('lodash');
const http = require('http');
const xml = require('xml');


// ToDo: Make this configurable
const pingList = [
  {host: 'blogsearch.google.com', path: '/ping/RPC2'},
  {host: 'rpc.pingomatic.com', path: '/'}
];


function ping(post) {
  let pingXML;
  let title = post.title;
  let url = 'http://nodeza/blog/' + post.slug;

  // Only ping when in production and not a page
  if (process.env.NODE_ENV !== 'production') {
    return false;
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
    let options = {
      hostname: pingHost.host,
      path: pingHost.path,
      method: 'POST'
    };
    let req;

    req = http.request(options);
    req.write(pingXML);
    req.on('error', function (error) {
      console.error(error.stack);
    });
    req.end();
  });
}



module.exports.ping = ping;
