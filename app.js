var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    users = require('./routes/users'),
    products = require('./routes/products'),
    categories = require('./routes/categories'),
    ratings = require('./routes/ratings'),
    images = require('./routes/images'),
    bids = require('./routes/bids'),
    cors = require('cors'),
    app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('superSecret', config.secret);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/ratings', ratings);
app.use('/api/images', images);
app.use('/api/bids', bids);

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
