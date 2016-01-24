var request = require('request'),
    config = require('../config');

var bids = function (io) {
    io.on('connection', function (socket) {
        socket.on('subscribe', function (userID) {
            socket.join(userID);
        });

        socket.on('unsubscribe', function (userID) {
            socket.leave(userID);
        });

        socket.on('watch', function (productID) {
            socket.join(productID);
        });

        socket.on('unwatch', function (productID) {
            socket.leave(productID);
        });

        socket.on('bid', function (data) {
            request({
                url: config.ss_bid_service + '/' + data.productID,
                method: 'POST',
                json: true,
                body: data.bid
            }, function (error, response, body) {
                if (error)
                    return error;
                io.sockets.in(data.ownerID).emit('bidUpdate', body);
                io.sockets.in(data.productID).emit('watchUpdate', body);
            });
        });
    });
};

module.exports = bids;
