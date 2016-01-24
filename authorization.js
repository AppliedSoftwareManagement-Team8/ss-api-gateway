var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('./config');
var authorize = function(req, res, next) {
  var token = '';

  // check header or url parameters or post parameters for token
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    var part = authorization.split(' ');
    if (part.length === 2) {
      token = part[1];
    } else {
      return null;
    }
  } else {
    token = req.body.token || req.query.token;
  }

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
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
};

module.exports = authorize;
