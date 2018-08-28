// Load modules
var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var router = express.Router();
var auth = require('./lib/auth.js');

// Middleware to sent response with headers
router.use(function(req, res, next){
	res.setHeader('Content-Type', 'application/json')
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

	next();
});

// Create new user by registration endpoint
router.post('/registration', function(req, res){
	controllers (req, "registration", res);
})

// Create new token by login endpoint
router.post('/login', function(req, res){	
	controllers (req, "login", res);
})

/*
// Authorize/validate incoming token
router.use(function(req, res, next){
	if(req.headers && req.headers.authorization){
		console.log(' -- Authorization: '+ req.headers.authorization);
		auth(req, res, function(result){
			console.log('-- result: ' + result)
			next();
		})
	}
	else{
		res.status(401).end(JSON.stringify({message: 'Unauthorized'}));
	}	
})
*/

// Get user by id 
router.use('/user/:id', function(req, res){
	controllers (req, "user", res);
})

// Create new token by login endpoint
router.use('/user', function(req, res){	
	controllers (req, "user", res);
})

// Response undefined url 
router.use('*', function(req, res){
	res.status(404).send({message: 'Not Found, Invalid URL'});
})

// Handled error and send response
router.use(function(err, req, res, next){
	console.log(' -- err_handled: ' + err);
	res.status(500).send({message: err})
})

// Calling controller according consumed url
function controllers (event, fileName, res){
	
	console.log(' -- calling_controller: ' + './controllers/' + fileName + '.js');		
	console.log(' -- event.method: ' + event.method);		
	
	try{
		var controller = require('./controllers/' + fileName + '.js');
	}
	catch(err){
		res.status(404).send({message: 'Not Found, please check url'});
	}	
	controller[event.method](event, res);
}

module.exports = router;

