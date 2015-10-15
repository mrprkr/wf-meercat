// Get the packages we need
var express 	= require('express');
var app				= express();
var jade 			= require('jade');
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var morgan			= require('morgan');

var jwt 			= require('jsonwebtoken');
var config 		= require('./config')
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





// ===============
// App routes
// ===============
app.get('/', function(req,res){
	res.render('home')
});

app.get('/setup', function(req, res){
	// create a simple user
	var user = new User({
		name: req.body.name,
		password: req.body.password,
		admin: req.body.admin
	})
	// save the new user
	user.save(function(err){
		if(err) throw err;
		console.log('User saved successfully');
		res.json({success:true})
	});
});



var apiRoutes = require('./app/routes/apiRoutes');


app.use('/api', apiRoutes)




app.listen(port);
console.log('Service running on port: '+port);