const { getPool, sql } = require('../config/db');

/**
 * GET /trips/:tripId/activities
 * Returns all activities for a given trip, ordered by date.
 */
const getActivitiesByTrip = async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);

  if (isNaN(tripId)) {
    return res.status(400).json({ error: 'Invalid trip ID' });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input('tripId', sql.Int, tripId)
      .query(
        'SELECT * FROM Activities WHERE tripId = @tripId ORDER BY activityDate ASC, createdAt ASC'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching activities:', err.message);
    res.status(500).json({ error: 'Failed to fetch activities', details: err.message });
  }
};

/**
 * POST /trips/:tripId/activities
 * Creates a new activity for a trip. Requires title and activityDate.
 */
const createActivity = async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  const { title, activityDate, notes } = req.body;

  if (isNaN(tripId)) {
    return res.status(400).json({ error: 'Invalid trip ID' });
  }

  if (!title || !activityDate) {
    return res.status(400).json({ error: 'title and activityDate are required' });
  }

  try {
    const pool = getPool();

    // Verify the parent trip exists
    const tripCheck = await pool
      .request()
      .input('tripId', sql.Int, tripId)
      .query('SELECT id FROM Trips WHERE id = @tripId');

    if (tripCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const result = await pool
      .request()
      .input('tripId', sql.Int, tripId)
      .input('title', sql.NVarChar(255), title.trim())
      .input('activityDate', sql.Date, activityDate)
      .input('notes', sql.NVarChar(sql.MAX), (notes || '').trim())
      .query(`
        INSERT INTO Activities (tripId, title, activityDate, notes, createdAt)
        OUTPUT INSERTED.*
        VALUES (@tripId, @title, @activityDate, @notes, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating activity:', err.message);
    res.status(500).json({ error: 'Failed to create activity', details: err.message });
  }
};

/**
 * DELETE /activities/:id
 * Deletes a single activity by its ID.
 */
const deleteActivity = async (req, res) => {
  const activityId = parseInt(req.params.id, 10);

  if (isNaN(activityId)) {
    return res.status(400).json({ error: 'Invalid activity ID' });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, activityId)
      .query('DELETE FROM Activities WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err.message);
    res.status(500).json({ error: 'Failed to delete activity', details: err.message });
  }
};

module.exports = { getActivitiesByTrip, createActivity, deleteActivity };
