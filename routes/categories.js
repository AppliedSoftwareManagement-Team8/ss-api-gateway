var express = require('express');
var request = require('request');
var config = require('../config');
var authorize = require('../authorization');
var router = express.Router();

/* GET single category by ID */
router.get('/', function (req, res) {
    request(config.ss_category_service + '/public/api/categories', function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

/* GET single category by ID */
router.get('/:id', function (req, res) {
    request(config.ss_category_service + '/public/api/categories/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(response.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

// route middleware to verify the token
router.use(authorize);

/* Create a new Category */
router.post('/create', function (req, res) {
    request({
        url: config.ss_category_service + '/public/api/user/categories',
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

/* Update Category */
router.put('/:id', function (req, res) {
    request({
        url: config.ss_category_service + '/public/api/user/categories/' + req.params.id,
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'PUT',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        else if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else {
            var user = JSON.parse(body);
            res.status(201, "Created").json(user);
        }
    });
});

router.delete('/:id', function (req, res) {
    request.del(config.ss_category_service + '/public/api/categories/' + req.params.id, function (error, response, body) {
        if (error)
            res.status(error.status || 500).json(error);
        if (body.hasOwnProperty('error'))
            res.status(body.status || 500).json(body);
        else
            res.status(200).json(JSON.parse(body));
    });
});

module.exports = router;