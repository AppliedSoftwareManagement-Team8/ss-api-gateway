var express = require('express');
var request = require('request');
var jwt = require('jsonwebtoken');
var authorize = require('../authorization');
var router = express.Router();

router.post('/authenticate', function(req, res) {
  request({
    url: 'http://localhost:8080/api/user/authenticate',
    qs: {from: 'api-gateway', time: +new Date()},
    method: 'POST',
    json: JSON.parse(req.body)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var user = JSON.parse(body);
      var token = jwt.sign(user, app.get('superSecret'), {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      user.token = token;
      res.json(user);
    } else {
      res.json( {
        success : false,
        message: 'Authentication failed!'
      } );
    }
  });
});

router.post('/register', function(req, res) {
  request({
    url: 'http://localhost:8080/api/user/register',
    qs: {from: 'api-gateway', time: +new Date()},
    method: 'POST',
    json: JSON.parse(req.body)
  }, function(error, response, body){
    if (!error && response.statusCode == 201) {
      var user = JSON.parse(body);
      res.json(user);
    } else {
      res.json( {
        success : false,
        message: 'Registration failed!'
      } );
    }
  });
});

router.post('/activate', function(req, res) {
  request({
    url: 'http://localhost:8080/api/user/activate',
    qs: {from: 'api-gateway', time: +new Date()},
    method: 'POST',
    json: JSON.parse(req.body)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var user = JSON.parse(body);
      var token = jwt.sign(user, app.get('superSecret'), {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      user.token = token;
      res.json(user);
    } else {
      res.json( {
        success : false,
        message: 'Registration failed!'
      } );
    }
  });
});

// route middleware to verify a token
router.use(authorize);

/* GET users listing. */
router.get('/', function(req, res) {
  request('http://localhost:8080/api/user', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  });
});

/* GET a single user by ID */
router.get('/:id', function(req, res) {
  request('http://localhost:8080/api/user/' + req.params.id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  });
});

module.exports = router;
