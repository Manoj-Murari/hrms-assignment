const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Define Routes
router.get('/', teamController.getTeams);
router.post('/', teamController.createTeam);

// --- CRITICAL EXPORT LINE ---
module.exports = router;