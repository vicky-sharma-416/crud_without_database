/* Load Dependant Modules */
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');

module.exports = {

    // Function to generate token for Payload for 15 minute
    generate: function (data) {

        var expiry = new Date();
		expiry.setMinutes(expiry.getMinutes() + 15);

		// Set the expiry date on the token data
		data.exp = parseInt(expiry.getTime() / 1000);

		return jwt.sign(data, config.jwt_sign);
        
    },

    // Function to verify the token and decode Payload
    verify: function (token, cb) {
		
        if (token) {
            // verify a token symmetric
            jwt.verify(token, config.jwt_sign, function (error, decoded) {
                if (error) {
                    cb(error.message, null);
                }
				else{
					cb(null, decoded);
				}
            });
        }
        else {
            cb("Missing Token");
        }
    }


};