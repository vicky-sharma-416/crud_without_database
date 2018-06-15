/* Load Dependant Modules */
var crypto = require('crypto');
var tokenObj = require('./token.js');
var config = require('../config/config.js');

module.exports = {

    // Function to generate token for Payload
    encrypted: function (tokenData){
	
		var cipher = crypto.createCipher(config.encrypted_method, config.crypto_key);
		
		// To handle 'bad decrypted value due to wrong key'  
		try{
			var crypted = cipher.update(tokenData.token, config.crypted_method, config.decrypted_method);
				crypted += cipher.final(config.decrypted_method);
			
			var token = tokenObj.generate(tokenData)
			
			var array = [];
				array.push(token);
				array.push(crypted);
			
			console.log(array);
			
			return array;		
		}
		catch(err){
			return err.message
		}
	},

    // Function to verify the token and decode Payload
    decryted: function (tokenData){
		
		// To handle error 'bad decrypted value due to wrong key'  
		try{
			var decipher = crypto.createDecipher(config.encrypted_method, config.crypto_key);
			var decrypted = decipher.update(tokenData, config.decrypted_method, config.crypted_method);
				decrypted += decipher.final(config.crypted_method);
			
			return decrypted;
		}
		catch(err){
			console.log(" -- decrypted_catch_err: " + err.message);
			return 401;
		}
	}


};