var fs = require('fs');
var config = require('../config/config.js');

module.exports = {
	
	create: function (filePath, body, callback){
		
		fs.writeFile(filePath, JSON.stringify(body), config.file_method, function (err) {
			if (err){
				console.log(' -- Write_file_err: ' + err);
				callback({message:err});
			}
			else{
				console.log('\n -- Created File Successfully !!');
				callback(body);
			}
		});
	},
	
	read: function (filePath, callback){
		
		console.log('filePath: '+ JSON.stringify(filePath));
		
		fs.readFile(filePath, config.file_method, function (err, data) {			
			if (err) {
				console.log(' -- Read_file_err: ' + err);
				callback({message:err});
			}
			else{
				var parseValue = data ? JSON.parse(data) : [];
				callback(parseValue);
			}
		});		
	}	
}