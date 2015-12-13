var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var users = require('./routes/users');
var categories = require('./routes/categories');
var ratings = require('./routes/ratings');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('superSecret', config.secret);
app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/ratings', ratings);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                error: {}
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            error: {}
        }
    });
});

module.exports = app;