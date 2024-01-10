const express = require('express');
const router = express.Router();

// require controllers
const shops = require('../controllers/shops');

// require database models
const Shop = require('../models/shop');

// require error handlers
const catchAsync = require('../utils/catchAsync');

// require middlewares for authorization, authentication, input validation
const { isLoggedIn, isAuthor, validateShop } = require('../middleware');

// require middleware for file upload
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


//-------------- APIs for shops --------------//
// show the shops list; can click the shop name to enter its detail page
router.get('/', catchAsync(shops.index));

// CREATE: add a new shop, save it to the database; then redirect to the detail page of the newly added shop
router.get('/new', isLoggedIn, shops.renderNewFrom);

router.post('/', isLoggedIn, upload.array('image'), validateShop, catchAsync(shops.createShop));

// READ: detail page for each shop
router.get('/:id', catchAsync(shops.showShop));

// UPDATE: edit and save the information of an existed shop; method-override to accomplish HTTP PUT request
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shops.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateShop, catchAsync(shops.updateShop));

// DELETE: delete an existed shop; method-override to accomplish HTTP DELETE request
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(shops.deleteShop));

module.exports = router;