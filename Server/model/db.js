
var mongoose = require('mongoose')
    , bcrypt = require('bcrypt')
    , SALT_WORK_FACTOR = 10;


//mongoose.connect('mongodb://localhost/patch3')

mongoose.connect('mongodb://localhost/patch');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to database');
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
        enddate: { type: Date, default: Date.now }
    }],
    comments: [{
        text: String,
        commentToStatus: String,
        by: String,
        added: {type: Date, default: Date.now }
    }],
    seen: [{
        seenBy: String,
        statusSeen: String
    }],
    likes: [{
        likesToStatus: String,
        by: String
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