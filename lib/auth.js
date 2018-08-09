var dencrypted = require('./dencrypted.js');
var file = require('./file.js');
var tokenObj = require('./token.js');
var filePath = './dbfiles/users.json'

module.exports = function(req, res, callback){

	// Get decrypted token as uuid
	var decrytedToken = dencrypted.decryted(req.headers.authorization);
	
	console.log(' -- DecrytedToken: ' + decrytedToken);
	
	// Check for Unauthorized request
	if(decrytedToken == 401){
		res.status(decrytedToken).send({message: 'Unauthorized'});
	}
	else{
		// Read file and get parse data
		file.read(filePath, function (parseValue){
			
			var isRecordExist = false;
			
			console.log(' -- parseValue: ' + parseValue);
			
			// Make sure having token value otherwise will create new one
			if(parseValue.tokens && parseValue.tokens.length > 0){
				
				parseValue.tokens
					.forEach(function(obj){

						// Check requested token is valid or not by jwt signature
						if(obj.token == decrytedToken){
							
							isRecordExist = true;								
							console.log('\n -- JWT_token: ' + obj.jwt_token);
							
							// Verify token by jwt
							tokenObj.verify(obj.jwt_token, function(err, data){
								
								if(err){										
									console.log('-- Token_err: ' + JSON.stringify(err));
								    res.status(401).send({message: err});
								}
								else{
									console.log('-- Token_data: ' + JSON.stringify(data));
									callback();
								}
							});
						}							
					})

					if(!isRecordExist){
						res.status(404).send({message: 'Token Not Found'});
					}
			}
			else{				
				res.status(404).send({message: 'Token Not Found'});					
			}
		})
	}
}