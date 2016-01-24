var express = require('express'),
    request = require('request'),
    config = require('../config'),
    authorize = require('../authorization'),
    router = express.Router();

/* GET get all categories */
router.get('/', function (req, res) {
    request(config.ss_category_service, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

/* GET single category by ID */
router.get('/:id', function (req, res) {
    request(config.ss_category_service + '/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

// route middleware to verify the token
router.use(authorize);

/* Create a new Category */
router.post('/create', function (req, res) {
    request({
        url: config.ss_category_service,
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'POST',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = JSON.parse(body);
        res.status(201, "Created").json(user);
    });
});

/* Update Category */
router.put('/:id', function (req, res) {
    request({
        url: config.ss_category_service + '/' + req.params.id,
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'PUT',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        var user = JSON.parse(body);
        res.status(201, "Created").json(user);
    });
});

/* Delete a Category by ID */
router.delete('/:id', function (req, res) {
    request.del(config.ss_category_service + '/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

module.exports = router;
