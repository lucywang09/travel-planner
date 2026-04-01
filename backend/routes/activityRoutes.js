const express = require('express');
const router = express.Router();
const { deleteActivity } = require('../controllers/activityController');

// DELETE /activities/:id
router.delete('/:id', deleteActivity);

module.exports = router;
