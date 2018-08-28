// Load modules
var fs = require('fs');
var file = require('../lib/file.js');
var filePath = './dbfiles/users.json';
		
module.exports = {
	
	POST: function(req, res){		
		//res.status(405).send({message: 'Method not allowed.'});
		// Read file and sent response to  its callback
		return new Promise(function(resolve, reject){ 
			file.read(filePath, function(result){
				
				console.log(' -- result: ' + (result ? JSON.stringify(result) : result.message));
					
				if(result && result.message){
					reject({statusCode: 500, message: result.message})
				}
				else if(result.emails.indexOf(req.body.email) != -1){
					reject({statusCode: 400, message: 'User with this email already exist, please use another one'})
				}
				else{
					//readCallback(result, req, res, handledResponse);
					resolve(result);
				}
			})	
		})
		.then(function(response){
			
			console.log('\n\n response: ', response);
			
			req.body.id = 1;
			
			if(response.users.length > 0){
				req.body.id = response.users.length + 1;
			}
			
			response.users.push(req.body);
			response.emails.push(req.body.email);
			
			// Create file with requested data
			file.create(filePath, response, function(output){
				if (output && output.message){
					res.status(500).send(output);
				}
				else{
					delete output.emails;
					res.status(201).send({user: output.users[(output.users.length-1)]});
				}
			})
		})
		.catch(function(error){
			console.log('\n\n error: ', error);
			res.status(error.statusCode).send({message: error.message});
		})
		/*
		var obj = {};
		
		obj.users.push(req.body);
		obj.emails.push(req.body.email);
		
		// Create file with requested data
		fs.appendFile(filePath, JSON.stringify(obj), function(output){
			console.log('\n\n output: ' + JSON.stringify(output));
			if (output && output.message){
				res.status(500).send(output);
			}
			else{
				res.status(201).send(output);
			}
		})*/
	},
	
	GET: function(req, res){

		console.log(' -- query ' + JSON.stringify(req.query));
		
		// Check req.query exist or not with right table/json key attributes
		if(Object.getOwnPropertyNames(req.query).length > 0 && !req.query.name && !req.query.email){
			res.status(400).send({message: 'This field is not exist.'});
		}
		// Check for params or querystring value
		else if((req.params && req.params.id) || (req.query && (req.query.name || req.query.email))){
			
			// Read file and sent its data to callback 
			file.read(filePath, function(result){				
				
				console.log(' -- result: ' + (result ? result.users : result.message));
					
				if(result && result.message){
					res.status(500).send(result);
				}
				else{
					// Read callback 
					readCallback(result, req, res, handledResponse);
				}
			})
		}
		else{
			// Read user data from table/json
			file.read(filePath, function(result){				
				console.log(' -- result: ' + JSON.stringify(result));
				
				if(result && result.message){
					res.status(500).send(result);
				}
				else{
					var obj = [];
					
					// Delete unwanted data from the records
					if(result && result.users.length > 0){
						result.users
							.forEach(function(element){							
								delete element.password;
								delete element.emails;
								delete element.tokens;
								
								obj.push(element);
							})
					}
					
					// Sent response
					res.status(200).send({users: obj});
				}
			})
		}
	},
	
	PUT: function(req, res){
		
		// Make sure email/id not updating, it's unique/PK key
		if(req.body && (req.body.email || req.body.id)){
			res.status(400).send({message: "Can't update " + (req.body.email ? 'email' : 'id') + "."});
		}
		else{
			// Read file and sent response to  its callback
			file.read(filePath, function(result){
				
				console.log(' -- result: ' + (result ? result.users : result.message));
					
				if(result && result.message){
					res.status(500).send(result);
				}
				else{
					readCallback(result, req, res, handledResponse);
				}
			})
		}
	},
	
	DELETE: function(req, res){
		
		/*if(!req.params && !req.params.id){
			res.status(403).send({message: 'Pleasep provide Id to update.'});
		}
		else{*/
		// Read file
		file.read(filePath, function(result){
			
			console.log(' -- result: ' + (result ? result.users : result.message));
				
			if(result && result.message){
				res.status(500).send(result);
			}
			else{
				readCallback(result, req, res, handledResponse);
			}
		})
		//}
	}	
}

// Read callback
function readCallback(output, req, res, callback){
	var array = []
	
	// Check fetch data length greater then zero or not, also check for error
	if((output.length == 0) || output.message || output.error){
		var obj = {};
			obj.statusCode = (output.length <= 0 || output.message) ? 404 : 500;
			obj.message = (output.length <= 0 || output.message) ? 'Not Found' : output.error;
			
			array.push(obj);
		callback(array, res);
	}
	// TODO :: need to handled unexpected delete file during running server and if user not exist as well
	else if(output.users && output.users.length > 0){						
		
		var isRecordExist = false;
		var index = 0;
		
		output.users
			.forEach(function(obj){
				
				console.log('\n\n obj: ' + JSON.stringify(obj))
				
				// Belong to pathParameters url like get/id, put/id, delete/id
				if(req.params.id == obj.id){
					isRecordExist = true;
					
					// Performing task for GET
					if(req.method == 'GET'){
						
						delete obj.password;					
						array.push(obj);
					}
					// Performing task for PUT
					else if(req.method == 'PUT'){
						
						// Update json key-value by requested body params and other(key-value) keep as-it-is
						Object.keys(req.body).forEach(function(key,value){
							
							// Getting undefined if existing key not coming in payload
							if(!req.body[key]){ 
								obj[key] = req.body[key]
							}
							else{
								obj[key] = req.body[key]
							}
						})
						
						// Remove/delete old json object from the file's data
						output.users.splice(index, 1);
						
						// Update new value at the same place of file
						output.users.splice(index, 0, obj);
						array.push(output);
					}
					// Performing task for DELETE
					else if(req.method == 'DELETE'){
						
						// Remove/delete json object from users and email 
						output.users.splice(index,1);
						output.emails.splice(index,1);
						
						array.push(output);
					}
					
					callback(array, res, req);
				}
				// Belongs to queryString type value
				else if(req.query && ((req.query.name == obj.name) || (req.query.email == obj.email))){
					isRecordExist = true;
					
					delete obj.password;
					
					array.push(obj);
					
					callback(array, res, req);
				}
				index++;
			})
		
		// Sent response
		if(array.length == 0 && !isRecordExist){
			var obj = {};
			obj.statusCode = 404;
			obj.message = 'Not Found';
			
			array.push(obj);
			callback(array, res)
		}
			
	}
}

// Sent response according to callback data and requested method
function handledResponse(output, res, req){
	
	if(output.length == 1 && output[0].message){
		res.status(output[0].statusCode).send({message: output[0].message});
	}
	else if(req.method == 'PUT'){
		file.create(filePath, output[0], function(result){
			if(result && result.message){
				res.status(500).send(result);
			}
			else{
				var updateObj = output[0].users[req.params.id-1];
				res.status(200).send({user: updateObj});
			}
		})
	}
	else if(req.method == 'DELETE'){
		console.log(' -- Record deleted successfully.');
		file.create(filePath, output[0], function(result){
			if(result && result.message){
				res.status(500).send(result);
			}
			else{
				res.status(204).send([]);
			}
		})
	}
	else{		
		var name = 'users';		
		var response = output;
			
		if(req.params && req.params.id){
			name = 'user';
			response = output[0];
		}
		
		var obj = {};
			obj[name] = response;
		
		res.status(200).send(obj);
	}
}






