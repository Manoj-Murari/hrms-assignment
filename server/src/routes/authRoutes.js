const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log("Auth Routes Loaded!");

router.post('/register', authController.register);
router.post('/login', authController.login);

// THIS LINE IS CRITICAL - IF MISSING, SERVER CRASHES
module.exports = router;