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
		
		fs.readFile(filePath, config.file_method, function (err, data) {
			
			console.log(' -- Read_file err: ' + err + ' \t -- data: ' + data.trim());
			
			if (err) {				
				callback({message:err});
			}
			else{
				var parseValue = data.trim() ? JSON.parse(data) : [];
				callback(parseValue);
			}
		});		
	}	
}
