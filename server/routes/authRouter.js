const express = require('express');
const router = express.Router();
const {googleLogin, manualLogin, signupUser} = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/manual', manualLogin);
router.post('/signup', signupUser);

module.exports = router;