var path     = require('path')
    , express  = require('express')
    , app      = module.exports = express()
    , api      = require('./routes/api')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , mongoose = require('mongoose')
    , bcrypt = require('bcrypt')
    , cors = require('cors');

var User = require('./model/db');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) { 	//Her må emailen være inne i variabelen/hete username selv om det egentlig er for emailen (passportjs sin skyld)
    User.findOne({ email: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown email ' + username }); }
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if(isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));


// Apparently needs to be used in such that req.body automatically gets parsed
// properly.
app.set('views', __dirname + '/app');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.logger("dev"));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cors());
app.use(express.session({ secret: 'resrhtjyfkgulhiøjo' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/../../public'));

// First looks for a static file: index.html, css, images, etc.
app.use("/app", express.compress());
app.use("/app", express.static(path.resolve(__dirname, "./app")));
app.use("/app", function(req, res, next) {
    res.send(404);
});
app.use(express.logger('dev')); // Log requests to the console

// This is the route that sends the base index.html file all other routes are
// for data only, no server-side views here.
app.all('/', ensureAuthenticated, function(req, res) { // Dette går til angular
    res.sendfile('index.html', { root: "app" });
});

app.get('/login', function(req, res){
    res.render('login');//ejs
});

app.get('/register', function(req, res){
    res.render('register');//ejs
});

//API
app.post('/api/addstatus/', api.addstatus);
app.post('/api/comment/', api.comment);
app.post('/api/register/', api.register);
app.post('/api/addfriend/', api.addfriend);
app.post('/api/acceptRequest/', api.acceptRequest);
app.post('/api/declineRequest/', api.declineRequest);
app.post('/api/deleteoldstatuses/:email', api.deleteoldstatuses);
app.post('/api/deletestatus/:email', api.deletestatus);

app.get('/api/GetOneUser/:email', api.GetOneUser);
app.get('/api/friends/:email', api.friends);
app.get('/api/friend/:email', api.friend);
app.get('/api/updatefriendlist/:email', api.updatefriendlist);
app.get('/api/queryforusers/:email', api.queryforusers);
app.get('/api/friend_requests/:email', api.friend_requests);

app.get('/getUser', function(req, res){
    User.findById(req.session.passport.user, function (err, user) {
        res.json(user);
    });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//
/***** This version has a problem with flash messages
 app.post('/login',
 passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
 function(req, res) {
    res.redirect('/');
  });
 */

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages =  [info.message];
            return res.redirect('/login')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

var port = process.env.PORT || 3001;
app.listen(port);

console.log('Server listening on port ' + port);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        console.log("ta å logg inn a din homo");
    }
    res.redirect('/login')
}