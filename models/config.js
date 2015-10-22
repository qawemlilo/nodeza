

var mongoose = require('mongoose');


var configSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true
  },

  data: Object

});



module.exports = mongoose.model('Config', configSchema);
