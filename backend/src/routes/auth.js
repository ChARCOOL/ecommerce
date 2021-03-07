const express = require('express');

const router = express.Router();

const { authCheck } = require('../middlewares/auth');
const { createOrUpdateUser } = require('../controllers/auth');
const { currentUser } = require('../controllers/auth');
const { emailAlreadyExists } = require('../controllers/auth');
const { resetEmail } = require('../controllers/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/email-already-exists', emailAlreadyExists);
router.post('/reset-email', authCheck, resetEmail);

module.exports = router;
