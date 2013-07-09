var path     = require('path'),
    express  = require('express'),
    cors     = require('cors'),
    app      = module.exports = express(),
    api      = require('./routes/api');

// Apparently needs to be used in such that req.body automatically gets parsed
// properly.
app.use(express.bodyParser());
app.use(cors());

// First looks for a static file: index.html, css, images, etc.
app.use("/app", express.compress());
app.use("/app", express.static(path.resolve(__dirname, "./app")));
app.use("/app", function(req, res, next) {
  res.send(404);
});
app.use(express.logger('tiny')); // Log requests to the console

// This is the route that sends the base index.html file all other routes are
// for data only, no server-side views here.
app.all('/', function(req, res) {
  res.sendfile('index.html', { root: "app" });
});

//API
app.post('/api/addstatus/', api.addstatus)
app.post('/api/register/', api.register);
app.post('/api/addfriend/', api.addfriend);
app.post('/api/deleteoldstatuses/:email', api.deleteoldstatuses);

app.get('/api/login/:email', api.login);
app.get('/api/friends/:email', api.friends);
app.get('/api/friend/:email', api.friend);



var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server listening on port ' + port);
