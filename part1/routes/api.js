const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.DogName AS dog_name, d.DogSize AS size, u.Username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.OwnerID = u.UserID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT wr.RequestID, d.DogName AS dog_name, wr.RequestTime,
             wr.WalkDuration, wr.WalkLocation, u.Username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.DogID = d.DogID
      JOIN Users u ON d.OwnerID = u.UserID
      WHERE wr.WalkStatus = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        u.Username AS walker_username,
        COUNT(r.RatingID) AS total_ratings,
        ROUND(AVG(r.StarRating), 1) AS average_rating,
        (
          SELECT COUNT(*)
          FROM WalkRequests wr
          JOIN WalkApps wa ON wr.RequestID = wa.RequestID
          WHERE wr.WalkStatus = 'completed'
            AND wa.WalkerID = u.UserID
            AND wa.AppsStatus = 'accepted'
        ) AS completed_walks
      FROM Users u
      LEFT JOIN RatingWalks r ON u.UserID = r.WalkerID
      WHERE u.RoleUser = 'walker'
      GROUP BY u.Username
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walker summaries' });
  }
});

module.exports = router;

