var express = require('express');
var request = require('request');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../config');
var authorize = require('../authorization');
var router = express.Router();

/* Register a new user */
router.post('/register', function (req, res) {
    req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/user/register',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        else if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else {
            var user = body;
            res.status(201, "Created").json(user);
        }
    });
});

/* Activate user's account */
router.post('/activate', function (req, res) {
    req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/user/activate',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        else if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else {
            var user = body;
            var token = jwt.sign(user, config.secret, {
                expiresIn: 3600 // seconds
            });
            user.token = token;
            res.status(200).json(user);
        }
    });
});

/* Authenticate user */
router.post('/authenticate', function (req, res) {
    req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/user/authenticate',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            res.status(error.error.status || 500).json(error);
        else if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body.error);
        else {
            var user = body;
            var token = jwt.sign(user, config.secret, {
                expiresIn: 3600 // seconds
            });
            user.token = token;
            res.status(200).json(user);
        }
    });
});

// route middleware to verify the token
router.use(authorize);

/* GET users listing. */
router.get('/', function (req, res) {
    request(config.ss_user_service + '/api/user', function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else
            res.status(200).json(body);
    });
});

/* GET single user by ID */
router.get('/:id', function (req, res) {
    request(config.ss_user_service + '/api/user/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else
            res.status(200).json(body);
    });
});

module.exports = router;