var express = require('express'),
    request = require('request'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    config = require('../config'),
    authorize = require('../authorization'),
    router = express.Router();

/* Register a new user */
router.post('/register', function (req, res) {
    req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/users/register',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = body;
        res.status(201, "Created").json(user);

    });
});

/* Activate user's account */
router.post('/activate', function (req, res) {
    request({
        url: config.ss_user_service + '/api/users/activate',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = body;
        var token = jwt.sign(user, config.secret, {
            expiresIn: 3600 // seconds
        });
        user.token = token;
        res.status(200).json(user);
    });
});

/* Authenticate user */
router.post('/authenticate', function (req, res) {
    req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/users/authenticate',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = body;
        var token = jwt.sign(user, config.secret, {
            expiresIn: 3600 // seconds
        });
        user.token = token;
        res.status(200).json(user);
    });
});

// route middleware to verify the token
router.use(authorize);

/* GET users listing. */
router.get('/', function (req, res) {
    request(config.ss_user_service + '/api/users', function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(body);
    });
});

/* GET single user by ID */
router.get('/:id', function (req, res) {
    request(config.ss_user_service + '/api/users/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(body);
    });
});

/* Delete a user */
router.delete('/:id', function (req, res) {
    request.del(config.ss_user_service + '/api/users/delete/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(body);
    });
});

/* Update Users' account information */
router.put('/', function (req, res) {
    if (req.body.password) req.body.password = crypto.createHmac('sha512', config.hashKey).update(req.body.password).digest('hex');
    request({
        url: config.ss_user_service + '/api/users/update/',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'PUT',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = body;
        var token = jwt.sign(user, config.secret, {
            expiresIn: 3600 // seconds
        });
        user.token = token;
        res.status(200).json(user);
    });
});

/* Block a User*/
router.post('/block/:id', function (req, res) {
    //TODO
    res.status(200).json({message: "In progress!"});
});

module.exports = router;