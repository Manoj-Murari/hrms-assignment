const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// All these routes are protected by the middleware in server.js
router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.post('/:id/assign-teams', employeeController.assignTeams);

module.exports = router;