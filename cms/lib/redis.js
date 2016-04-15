

var Redis = null;
var redis = require("redis");

module.exports = function (config) {
  "use strict";

  if (Redis) {
  	return Redis;
  }

  Redis = {};


  Redis = redis.createClient();

  Redis.on("error", function (err) {
    console.log("error event - " + Redis.host + ":" + Redis.port + " - " + err);
  });

  Redis.set("string key", "string val", redis.print);
  Redis.hset("hash key", "hashtest 1", "some value", redis.print);
  Redis.hset(["hash key", "hashtest 2", "some other value"], redis.print);

  Redis.hkeys("hash key", function (err, replies) {
    if (err) {
      return console.error("error response - " + err);
    }

    console.log(replies.length + " replies:");

    replies.forEach(function (reply, i) {
      console.log(" " + i + ": " + reply);
    });
  });

  Redis.quit(function (err, res) {
    console.log("Exiting from quit command.");
  });
};
