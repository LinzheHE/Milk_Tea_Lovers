const express = require('express');
const router = express.Router({ mergeParams: true });

// require controllers
const reviews = require('../controllers/reviews');

// require database models
const Shop = require('../models/shop');
const Review = require('../models/review');

// require error handlers
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// middlewares for input validation, authentication
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


//-------------- APIs for reviews --------------//
// POST: post a review to a shop
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE: delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;