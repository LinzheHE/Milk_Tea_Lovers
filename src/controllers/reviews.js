// require database models
const Shop = require('../models/shop');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const shop = await Shop.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    shop.reviews.push(review);
    await review.save();
    await shop.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/shops/${shop._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Shop.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete a review!');
    res.redirect(`/shops/${id}`);
}