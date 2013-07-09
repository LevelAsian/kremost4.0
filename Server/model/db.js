
var mongoose = require('mongoose')
    , bcrypt = require('bcrypt')
    , SALT_WORK_FACTOR = 10;


mongoose.connect('mongodb://admin:admin@ds031608.mongolab.com:31608/heroku_app16560192');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

// User Schema
var userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    friends: [],
    friend_requests: [],
    statuses: [{
        text: String,
        startdate:{ type: Date, default: Date.now },
        enddate: { type: Date, default: Date.now },
        comments: [{
            text: String,
            by: String,
            added: {type: Date, default: Date.now}
        }]
    }]
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = db.model('users', userSchema);