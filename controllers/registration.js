var fs = require('fs');
var file = require('../lib/file.js');
var filePath = './dbfiles/users.json';
		
module.exports = {
	
	POST: function(req, res){
		
		// Read file and fetch all available data
		file.read(filePath, function(data){
		
			console.log(' -- Read_data: ' + data);
			
			// Check data exist in file or not, ignoring error if file not exists and creating new file
			if(data && data.users){
				
				// Make sure both password is correct
				if(req.body.password != req.body.confirm_password){
					res.status(400).send({message: 'Both password should be same.'});
				}
				// Make sure unique user creating on each request
				else if(data.emails && data.emails.indexOf(req.body.email) != -1){
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
						if (output && output.message){
							res.status(500).send(output);
						}
						else{
							res.status(200).send({id: req.body.id, email: req.body.email, password: req.body.password});
						}
					})
				}
			}
			else{
				if(req.body.password != req.body.confirm_password){
					res.status(400).send({message: 'Both password should be same.'});
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
			}
		})
	}
}
