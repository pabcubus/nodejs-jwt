// Dependencies
var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var connection;
var secret;

var unsecuredEndpoints	= ['login', 'register', 'logout'];

// This part is to get the Sequelize connection and also to overpass the CORS restriction
router.use(function(req, res, next) {
	connection	= req.app.get('connection');
	secret		= req.app.get('superSecret');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// This part is for setting the authentication on each of the endpoints, minus the login and register
router.use(function(req, res, next) {
	var filteredEndpoints = _.filter(unsecuredEndpoints, function(item){
		return req.originalUrl.indexOf(item) != -1;
	});

	if (!_.isArray(filteredEndpoints) || filteredEndpoints.length == 0){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (_.isString(token)) {

			// verifies secret and checks exp
			jwt.verify(token, secret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes

					if (blacklist.exists(token)){
						return res.status(403).send({
							success: false,
							message: 'Token blacklisted'
						});
					} else {
						req.decoded = decoded;
						next();
					}
				}
			});

		} else {

			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}
	} else {
		next();
	}
});

router.get('/', function(req, res) {
		connection.sync().then(function() {
			Person.findAll()
			.then(function(persons){
				return res.json(persons);
			});
		});
	}
);

router.get('/profile', function(req, res) {
		var token = req.query.token;

		if (_.isString(token)) {
			var decoded = jwt.decode(token);
			return res.json(decoded);
		} else {
			return res.status(403).send({
				success: false,
				message: 'Access denied'
			});
		}
	}
);

router.post('/register', function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		if (_.isString(username) && username.length > 0 && _.isString(password) && password.length > 0) {
			connection.sync().then(function() {
				Person.create({
					'username': username,
					'password': password,
					'creation': new Date(),
					'active': true
				})
				.then(function(person) {
					return res.json({
						success: true,
						message: 'User created!'
					});
				})
				.catch(function() {
					return res.status(500).json({
						success: false,
						message: 'Internal error. Try again later.'
					});
				});
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'Non-valid username and password'
			});
		}
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
					'username': username,
					'password': password
				}
			})
			.then(function(persons){
				if (persons.length > 0) {
					var user = JSON.parse(JSON.stringify(persons[0]));

					var usertoken = jwt.sign(user, secret, {
						expiresIn: 1440
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

router.post('/logout', function(req, res) {
		var token = req.body.token;

		// decode token
		if (_.isString(token)) {
			if (blacklist.exists(token)){
				return res.status(403).send({
					success: false,
					message: 'Token blacklisted'
				});
			} else {
				blacklist.add(token);

				return res.json({
					success: true,
					message: 'Token revoked'
				});
			}
		} else {
			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	}
);

// This object is to store and check all the blacklisted tokens
var blacklist = {
	tokens: [],
	exists: function(token) {
	var filtered = _.filter(this.tokens, function(item){
			return item == token;
		});

		return !_.isArray(filtered) || filtered.length == 0 ? false : true;
	},
	add: function(token) {
		this.tokens.push(token);
	}
}

// Return router
module.exports = router;
