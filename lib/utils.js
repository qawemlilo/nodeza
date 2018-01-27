"use strict";

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';


module.exports.encrypt = function (text, secret) {
  let cipher = crypto.createCipher(algorithm, secret);
  let crypted = cipher.update(text,'utf8','hex');

  crypted += cipher.final('hex');

  return crypted;
};


module.exports.decrypt = function (text, secret) {
  let decipher = crypto.createDecipher(algorithm, secret);
  let dec = decipher.update(text,'hex','utf8');

  dec += decipher.final('utf8');

  return dec;
};
