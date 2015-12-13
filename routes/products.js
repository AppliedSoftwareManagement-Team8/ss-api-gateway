var express = require('express'),
    request = require('request'),
    config = require('../config'),
    authorize = require('../authorization'),
    router = express.Router();

/* Create a new Product */
router.post('/', function (req, res) {
    request({
        url: config.ss_product_service + '/api/',
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

/* Get all products */
router.get('/', function (req, res) {
    request(config.ss_product_service + '/api/', function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

/* GET all Products of a user by ID */
router.get('/owner/:id', function (req, res) {
    request(config.ss_product_service + '/api/owner/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(body);
    });
});

/* GET a product page by Category */
router.get('/category/:id/:pageNum', function (req, res) {
    request(config.ss_product_service + '/api/category/' + req.params.id + '/' + req.params.pageNum, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(body);
    });
});

/* GET a product page by search query */
router.get('/search/:query/:pageNum', function (req, res) {
    request(config.ss_product_service + '/api/search/' + req.params.query + "/" + req.params.pageNum, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(response.status || 200).json(body);
    });
});

/* GET single Product by ID */
router.get('/:id', function (req, res) {
    request(config.ss_product_service + '/api/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

/* Update Product */
router.put('/:id', function (req, res) {
    request({
        url: config.ss_product_service + '/api/' + req.params.id,
        qs: {from: 'api-gateway', time: +new Date()},
        method: 'PUT',
        json: true,
        body: req.body
    }, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        return res.status(200).json(body);
    });
});

/* Delete a Product by ID */
router.delete('/:id', function (req, res) {
    request.del(config.ss_product_service + '/api/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

module.exports = router;