var fs = require('fs');
var file = require('../lib/file.js');
var filePath = './dbfiles/users.json';
		
module.exports = {
	
	POST: function(req, res){
		
		// Read file and fetch all available data
		file.read(filePath, function(data){
		
			console.log(' -- Read_data: ' + JSON.stringify(data));
			
			console.log(req.body.password + ' != ' + req.body.confirm_password)
				
			if(!req.body.password || !req.body.confirm_password || !req.body.email){
				res.status(400).send({message: 'Please check and provide all field, email, password, confirm_password'});
			}
			// Make sure both password is correct
			else if(req.body.password != req.body.confirm_password){
				res.status(400).send({message: 'Password and confirm password are not same.'});
			}
			// Check data exist in file or not, ignoring error if file not exists and creating new file
			else if(data && data.users && data.users.length > 0){
				
				// Make sure unique user creating on each request
				if(data.emails && data.emails.indexOf(req.body.email) != -1){
					res.status(400).send({message: 'User with this email id is already exist.'});
				}
				else{						
					delete req.body.confirm_password;
					
					// Set Id to update/get/delete query
					req.body.id = data.users.length + 1;
					data.users.push(req.body);
					data.emails.push(req.body.email);
					
					// Create file with requested data
					file.create(filePath, data, function(output){
						console.log('\n\n output: ' + JSON.stringify(output));
						if (output && output.message){
							res.status(500).send(output);
						}
						else{
							delete output.emails;
							res.status(201).send({user: output.users});
							//res.status(200).send({id: req.body.id, email: req.body.email, password: req.body.password});
						}
					})
				}
			}
			else{
				delete req.body.confirm_password;
				
				req.body.id = 1;
				
				var obj = {};
				obj.users = [];
				obj.emails = [];
				
				obj.users.push(req.body);
				obj.emails.push(req.body.email);
				
				// Create file with requested data
				file.create(filePath, obj, function(output){
					if (output && output.message){
						res.status(500).send(output);
					}
					else{
						res.status(200).send({id: req.body.id, email: req.body.email, password: req.body.password});
					}
				})
			}
		})
	}
}
