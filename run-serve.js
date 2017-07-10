
var express = require('express');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var propertiesReader = require('properties-reader');
var jwt = require('jsonwebtoken');

var nodeport = process.env.PORT || 3210;

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.set('superSecret', 'thisisasecret');

// Set the params for the ORM (Sequelize)
var properties 	= propertiesReader('config/db.properties');
var db 			= properties.get('db.pqrs.db');
var port 		= properties.get('db.pqrs.port');
var user 		= properties.get('db.pqrs.user');
var password 	= properties.get('db.pqrs.password');

var connectionString = 'postgresql://' + user + ':' + password + '@localhost:'+ port +'/' + db;

var connection = new Sequelize(connectionString, {
	define: {
		timestamps: false
	}
});

require('./persistence/config').start(Sequelize, connection);

app.set('connection', connection);

// Routes
app.use('/api/person', require('./routes/person'));

app.listen(nodeport);
console.log('Magic happens at http://localhost:' + nodeport);
