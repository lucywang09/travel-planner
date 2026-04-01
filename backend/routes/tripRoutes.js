const express = require('express');
const router = express.Router();
const { getAllTrips, createTrip, deleteTrip } = require('../controllers/tripController');
const { getActivitiesByTrip, createActivity } = require('../controllers/activityController');

// GET    /trips
router.get('/', getAllTrips);

// POST   /trips
router.post('/', createTrip);

// DELETE /trips/:id
router.delete('/:id', deleteTrip);

// GET    /trips/:tripId/activities
router.get('/:tripId/activities', getActivitiesByTrip);

// POST   /trips/:tripId/activities
router.post('/:tripId/activities', createActivity);

module.exports = router;
