var express = require('express');
var request = require('request');
var config = require('../config');
var authorize = require('../authorization');
var router = express.Router();

// route middleware to verify the token
router.use(authorize);

/* Get all ratings */
router.get('/', function (req, res) {
    request(config.ss_rating_service + '/public/api/ratings', function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

/* Get a single rating by it's ID */
router.get('/:id', function (req, res) {
    request(config.ss_rating_service + '/public/api/ratings/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

/* Get all ratings of a publisher */
router.get('/pub/:id', function (req, res) {
    request(config.ss_rating_service + '/public/api/ratings/publishers/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

/* Get all ratings of a recipient */
router.get('/rec/:id', function (req, res) {
    request(config.ss_rating_service + '/public/api/ratings/recipients/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

/* Post a new Rating about a user */
router.post('/create', function (req, res) {
    request({
        url: config.ss_rating_service + '/public/api/ratings/create',
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        else if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else {
            var user = JSON.parse(body);
            res.status(201, "Created").json(user);
        }
    });
});

/* Delete a rating by it's iD */
router.delete('/:id', function (req, res) {
    request.del(config.ss_rating_service + '/public/api/ratings/delete/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

module.exports = router;