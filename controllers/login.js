// Load modules
var fs = require('fs');
var jwt = require('jsonwebtoken');
var uuid = require('uuid');
var crypto = require('crypto');
var dencrypted = require('../lib/dencrypted.js');
var file = require('../lib/file.js');

var filePath = './dbfiles/users.json'
var encryptedToken = null;

module.exports = {
	
	POST: function(req, res){
		
		console.log(req.body)
		
		file.read(filePath, function(parseValue){
			
			if(parseValue && parseValue.users){
				
				var currentTime = new Date().getTime();
			
				if(parseValue && parseValue.tokens && parseValue.tokens.length > 0){
					
					parseValue.tokens
						.forEach(function(obj){
							
							// Comparing user_id(email) to requested email and check its token life, if greater then current time then provide the same
							if(obj.user_id == req.body.email && obj.exp >= parseInt(currentTime/1000)){
								console.log('\n -- Token already exist: ' + encryptedToken);
								res.status(200).send({token: encryptedToken});
							}
							else{
								console.log('\n -- New token will created');
								createToken(parseValue, req, res);
							}
						})
				}
				else{
					createToken(parseValue, req, res);
				}
			}
			else{
				res.status(404).send({message: 'Not Found, Please Register User First'});
			}
		})
	}
}

function createToken(parseValue, req, res){
	
	var i = 0;	
	parseValue.users
		.forEach(function(elements){
			
			console.log(elements.email + ' == ' + req.body.email);
				
			// Get each value comparison with requested body value 
			//if(elements.email == req.body.email && elements.password == req.body.password){			
			if(elements.email == req.body.email){
				console.log('\n -- User credentials found');
				
				// Append token table/key if not exist
				if(!parseValue.tokens){
					parseValue.tokens = [];
				}
				
				// Put initially uuid value as a token value
				var uuidValue = uuid.v4();
				var obj = {};
					obj.token = uuidValue;
				
				var token = dencrypted.encrypted(obj);
				
				console.log('\n --Encrypted_token: ' + JSON.stringify(token));
				
				obj.jwt_token = token[0];
				
				// Initialize by encrypted token
				encryptedToken = token[1];
				
				// Put email as a user_id as a FK in token table
				obj.user_id = req.body.email;
				
				parseValue.tokens.push(obj);
				
				// Create file with data
				file.create(filePath, parseValue, function(output){
					if (output && output.message){
						res.status(500).send(output);
					}
					else{
						res.status(200).send({token: encryptedToken});
					}
				})
			}
			else if(parseValue.users.length == ++i){
				res.status(404).send({message: 'Please check credentials and login again.'});
			}
	})
}


