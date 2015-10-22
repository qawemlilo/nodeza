

var mongoose = require('mongoose');


module.exports = function (url) {
  mongoose.connect(url);

  mongoose.connection.on('error', function() {
    console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
  });

  return mongoose;
};
