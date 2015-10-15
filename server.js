// Get the packages we need
var express 	= require('express');
var app				= express();
var jade 			= require('jade');
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var morgan			= require('morgan');
var methodOverride = require('method-override');

var jwt 			= require('jsonwebtoken');
var config 		= require('./config/config')
var User 			= require('./app/models/user');

// ===============
// Configuration
// ===============
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// Set body parser to use of JSON in POST 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// use morgan to log requests to console
app.use(morgan('dev'));

// Use Jade and the views folder to render contents
app.set('view engine', 'jade');
app.set('views', './app/views/')


var apiRoutes = require('./app/routes/apiRoutes');
app.use('/api', apiRoutes)


// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 




app.listen(port);
console.log('Service running on port: '+port);