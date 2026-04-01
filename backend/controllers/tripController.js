const { getPool, sql } = require('../config/db');

/**
 * GET /trips
 * Returns all trips ordered by creation date (newest first).
 */
const getAllTrips = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query('SELECT * FROM Trips ORDER BY createdAt DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching trips:', err.message);
    res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
  }
};

/**
 * POST /trips
 * Creates a new trip. Requires destination, startDate, endDate.
 */
const createTrip = async (req, res) => {
  const { destination, startDate, endDate } = req.body;

  if (!destination || !startDate || !endDate) {
    return res.status(400).json({
      error: 'destination, startDate, and endDate are required',
    });
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input('destination', sql.NVarChar(255), destination.trim())
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        INSERT INTO Trips (destination, startDate, endDate, createdAt)
        OUTPUT INSERTED.*
        VALUES (@destination, @startDate, @endDate, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating trip:', err.message);
    res.status(500).json({ error: 'Failed to create trip', details: err.message });
  }
};

/**
 * DELETE /trips/:id
 * Deletes a trip and all its associated activities.
 */
const deleteTrip = async (req, res) => {
  const tripId = parseInt(req.params.id, 10);

  if (isNaN(tripId)) {
    return res.status(400).json({ error: 'Invalid trip ID' });
  }

  try {
    const pool = getPool();

    // Delete associated activities first (referential integrity)
    await pool
      .request()
      .input('tripId', sql.Int, tripId)
      .query('DELETE FROM Activities WHERE tripId = @tripId');

    // Delete the trip
    const result = await pool
      .request()
      .input('id', sql.Int, tripId)
      .query('DELETE FROM Trips WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip and all its activities deleted successfully' });
  } catch (err) {
    console.error('Error deleting trip:', err.message);
    res.status(500).json({ error: 'Failed to delete trip', details: err.message });
  }
};

module.exports = { getAllTrips, createTrip, deleteTrip };
