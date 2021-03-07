const express = require('express');

const router = express.Router();

const { authCheck, adminCheck } = require('../middlewares/auth');

const { create, read, update, remove, list, rating, search } = require('../controllers/product');

router.post('/product', authCheck, adminCheck, create);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/products', list);

router.post('/add-rating', authCheck, rating);
router.post('/search-product', search);

module.exports = router;
