var express = require('express'),
  request = require('request'),
  config = require('../config'),
  authorize = require('../authorization'),
  router = express.Router();

// route middleware to verify the token
router.use(authorize);

/* Create a new Product Bids */
router.post('/', function(req, res) {
  request({
    url: config.ss_bid_service + '/',
    qs: {
      from: 'api-gateway',
      time: +new Date()
    },
    method: 'POST',
    json: true,
    body: req.body
  }, function(error, response, body) {
    if (error)
      return res.status(error.status || 500).json(error);
    res.status(201, "Created").json(body);
  });
});

router.get('/:itemID', function(req, res, next) {
  request(config.ss_bid_service + '/' + req.params.itemID, function(error, response, body) {
    if (error) {
      return res.status(error.status || 500).json(error);
    }
    res.status(200).json(body);
  });
});

router.get('/bidder/:userID', function(req, res, next) {
  request(config.ss_bid_service + '/bidder/' + req.params.userID, function(error, response, body) {
    if (error) {
      return res.status(error.status || 500).json(error);
    }
    res.status(200).json(body);
  });
});

router.get('/user/:userID', function(req, res, next) {
  request(config.ss_bid_service + '/user/' + req.params.userID, function(error, response, body) {
    if (error) {
      return res.status(error.status || 500).json(error);
    }
    res.status(200).json(body);
  });
});

/* Delete a Product Bids*/
router.delete('/:id', function(req, res, next) {
  request.del(config.ss_product_service + '/' + req.params.id, function(error, response, body) {
    if (error)
      return res.status(error.status || 500).json(error);
    res.status(200).json(JSON.parse(body));
  });
});

/* Delete a single Product Bid*/
router.delete('/:productID/:bidId', function(req, res, next) {
  request.del(config.ss_product_service + '/' + req.params.productID + '/' + req.params.bidId, function(error, response, body) {
    if (error)
      return res.status(error.status || 500).json(error);
    res.status(200).json(JSON.parse(body));
  });
});

module.exports = router;
