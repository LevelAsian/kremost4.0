var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://admin:admin@ds031608.mongolab.com:31608/heroku_app16560192');


var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  friends: [],
  friend_requests: [],
  statuses: [{
      text: String,
      startdate:{ type: Date, default: Date.now },
      enddate: { type: Date, default: Date.now }
  }]
});

module.exports = db.model('users', userSchema);