// Load modules
var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var router = express.Router();
var db = require('./db.js');

// Create new user by registration endpoint
router.post('/registration', function(req, res){
	res.status(200).send({message: 'Regisetered successfully'});
})

// Create new token by login endpoint
router.post('/login', function(req, res){	
	controllers (req, "login", res);
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
	try{
		var controller = require('./controllers/' + fileName + '.js');
	}
	catch(err){
		res.status(404).send({message: 'Not Found, please check url'});
	}	
	controller[event.method](event, res);
}

module.exports = router;

