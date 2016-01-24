var express = require('express'),
    request = require('request'),
    config = require('../config'),
    authorize = require('../authorization'),
    router = express.Router(),
    path = require('path'),
    multer = require('multer'),
    storage = multer.memoryStorage(),
    upload = multer({
        storage: storage
    }).array('image', 12);
const Imagemin = require('imagemin');

// route middleware to verify the token
router.use(authorize);

router.get('/users/:userID', function(req, res, next) {
  request(config.ss_image_service + '/users/' + req.params.userID, function(error, response, body) {
    if (error) {
      return res.status(error.status || 500).json(error);
    }
    res.status(200).json(body);
  });
});

router.get('/products/:id', function(req, res, next) {
  request(config.ss_image_service + '/products/' + req.params.id, function(error, response, body) {
    if (error) {
      return res.status(error.status || 500).json(error);
    }
    res.status(200).json(body);
  });
});

/* Delete a Category by ID */
router.delete('/:id', function (req, res) {
    request.del(config.ss_image_service + '/delete/' + req.params.id, function (error, response, body) {
        if (error)
            return res.status(error.status || 500).json(error);
        res.status(200).json(JSON.parse(body));
    });
});

/* Upload an Image */
router.post('/', upload, function (req, res) {
    req.files.forEach(function (file) {
        var ext = path.extname(file.originalname),
            image;
        new Imagemin().src(file.buffer).use(getCompressionType(ext, res)).run(function (err, files) {
            if (err) {
                return next(err);
            }
            var userID = req.body.user_id ? req.body.user_id : "",
                productID = req.body.product_id ? req.body.product_id : "",
                profile = !!req.body.profile,
                main = !!req.body.main,
                result = null;
            var data = {
                image: files[0].contents.toString('base64'),
                ext: files[0].path.substr(files[0].path.lastIndexOf('.') + 1),
                user_id: req.body.user_id,
                product_id: productID,
                profile: profile,
                main: main
            };
            request({
                url: config.ss_image_service + '/create',
                method: 'POST',
                json: true,
                body: data
            }, function (error, response, body) {
                if (error)
                    return res.status(error.status || 500).json(error);
                res.status(200).json(body);
            });
        });
    });
});

getCompressionType = function(ext, res) {
    var compressionType;
    switch (ext) {
        case '.jpg':
            compressionType = Imagemin.jpegtran({progressive: true});
            break;
        case '.png':
            compressionType = Imagemin.optipng({optimizationLevel: 3});
            break;
        case '.gif':
            compressionType = Imagemin.gifsicle({interlaced: true});
            break;
        case '.svg':
            compressionType = Imagemin.svgo();
            break;
        default:
            return res.status(415, "Unsupported media type").json(error);
    }
    return compressionType;
};

module.exports = router;
