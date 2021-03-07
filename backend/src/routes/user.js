const express = require('express');

const router = express.Router();

const { authCheck } = require('../middlewares/auth');
const { updateShipping, updateCart, getCart } = require('../controllers/user');

router.post('/update-shipping', authCheck, updateShipping);
router.post('/update-cart', authCheck, updateCart);
router.get('/get-cart', authCheck, getCart);

module.exports = router;
