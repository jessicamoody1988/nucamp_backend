const express = require('express');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200)) 
.get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorite => {
                req.body.forEach(fav => {
                    if (!favorite.campsites.includes(fav._id)) {
                        favorite.campsites.push(fav._id);
                    }
                });
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }
    }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorite => {
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete');
        }
    })
})

favorteRouter.route('/:favoriteId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.favoriteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.favoriteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

})

module.exports = favoriteRouter;