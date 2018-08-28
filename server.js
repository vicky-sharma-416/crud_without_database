// Load module
var express = require('express'); 
var bodyParser = require('body-parser'); 
var app = express(); 
var router = require('./router.js');
var cors = require('cors');

// App to use bodyParser() 
app.use(bodyParser.urlencoded({extended: false})); 

// Get the data from a POST 
app.use(bodyParser.json());
app.use(cors());

// Route url to router 
app.use('/', router); 

// Create server 
//var server = app.listen(8081, function () { 
var server = app.listen(8090, function () { 
	var host = server.address().address; 
	var port = server.address().port;
	console.log("Example app listening at http://localhost:" + port); 
})