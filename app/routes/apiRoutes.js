// ===============
// API Routes
// ===============

var express 	= require('express');
var app				= express();
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var morgan			= require('morgan');

var jwt 			= require('jsonwebtoken');
var User 			= require('../models/user');



var apiRoutes = express.Router();


// respond
apiRoutes.get('/', function(req, res){
	res.json({message: 'Welcome to the API'})
});


// ===================
// USERS
// ===================

// show a list of users
apiRoutes.get('/users', function(req,res){
		User.find(function(err, users){
		res.json(users);
	});
})


// create a new user
apiRoutes.post('/user', function(req, res){
	// populate the scheme
	var user = new User({
		name: req.body.name,
		password: req.body.password,
		admin: req.body.admin || false
	})
	// save the new user
	user.save(function(err){
		if(err) throw err;
		console.log('User saved successfully');
		res.json({success:true})
	});
});



// Lookup a single user
apiRoutes.get('/user/:userId', function(req, res){
	User.findById(req.params.userId, function(err, user){
		if(err){
			res.send(err)
		} else{
			res.json(user);
		}
	});
});

// delete a single user
apiRoutes.delete('/user/:userId', function(req, res){
	User.remove({_id:req.params.userId}, function(err, user){
		if(err){
			res.send(err)
		} else{
			res.json({success:true, message:"User deleted"})
		}
	});
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



// function to check if the user has a token or not
var hasToken = function(req,res){
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
}

module.exports = apiRoutes;