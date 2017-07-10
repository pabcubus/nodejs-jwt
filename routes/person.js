// Dependencies
var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var connection;
var secret;

router.use(function(req, res, next) {
	connection	= req.app.get('connection');
	secret		= req.app.get('superSecret');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

router.post('/login', function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		if (!_.isString(username) || !_.isString(password))
			return res.json({message: 'Invalid Credentials'});

		connection.sync().then(function() {
			Person.findAll({
				where: {
					'username': username
				}
			})
			.then(function(persons){
				if (persons.length > 0) {
					var user = JSON.parse(JSON.stringify(persons[0]));

					var usertoken = jwt.sign(user, secret, {
						expiresIn: 1440 // expires in 24 hours
					});

					return res.json({
						success: true,
						message: 'Enjoy your token!',
						token: usertoken
					});
				} else {
					return res.json({message: 'There\'s no user with those credentials'});
				}
			});
		});
	}
);



router.post('/login', function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		if (!_.isString(username) || !_.isString(password))
			return res.json({message: 'Invalid Credentials'});

		connection.sync().then(function() {
			Person.findAll({
				where: {
					'username': username
				}
			})
			.then(function(persons){
				if (persons.length > 0) {
					var user = JSON.parse(JSON.stringify(persons[0]));

					var usertoken = jwt.sign(user, secret, {
						expiresIn: 1440 // expires in 24 hours
					});

					return res.json({
						success: true,
						message: 'Enjoy your token!',
						token: usertoken
					});
				} else {
					return res.json({message: 'There\'s no user with those credentials'});
				}
			});
		});
	}
);

// Return router
module.exports = router;
