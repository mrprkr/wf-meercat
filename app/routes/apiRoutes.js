// ===============
// API Routes
// ===============

var express 	= require('express');
var app				= express();
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var morgan			= require('morgan');

var jwt 			= require('jsonwebtoken');
var config 		= require('../../config');
var User 			= require('../models/user');



var apiRoutes = express.Router();


// respond
apiRoutes.get('/', function(req, res){
	res.json({message: 'Welcome to the API'})
});



// authenticate a user and generate a token
apiRoutes.post('/authenticate', function(req,res){
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if(err) throw err;

		if(!user){
			res.json({success:false, message:'Authentication failed, user not found'})
			} else if(user) {
			// check the matched user's password is correct
			if(user.password != req.body.password) {
				res.json({success:false, message:'Wrong password'})
			} else {
				// if the user is found, and the password is correct, create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes:1440
				});
				// Send the token
				res.json({success:true, message:'token created', token: token});
			};
		}
	})
})

// validate a token
apiRoutes.use(function(req,res,next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded){
			if(err){
				return res.json({success:false, message:'Failed to decode token'})
			}
			else {
				req.decoded = decoded;
				next();
			}
		})
	}
	else{
		return res.status(403).send({
			success:false, message:'no token provided'
		});
	}
})




// get all users
apiRoutes.get('/users', function(req, res){
	User.find({}, function(err, users){
		res.json(users);
	});
});


module.exports = apiRoutes;