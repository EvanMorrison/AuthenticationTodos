var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');

var app = express();
var port = process.argv[2] || 5000;

// DATABASE
var config = require('./config');
mongoose.connect(config.database, function() {
    console.log('Mongo Connected');
});

// SERVE THE FRONTEND
app.use(express.static(path.join(__dirname, '..', '/frontend')));


// MIDDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
// Make the app use the express-jwt authentication middleware on anthing starting with '/api'
app.use('/api', expressJwt({secret: config.secret}));


// ROUTES
// require the '/todo' route to go through the express-jwt middleware before accessing any todos
app.use('/api/todo', require('./routes/todoRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// START SERVER
app.listen(port, function() {
    console.log("Server started on port: " + port);
})