const express = require('express');
const apiRoutes = require('./routes/api');
const db = require('./models/db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', apiRoutes);

async function seedData() {
  try {
    // Insert users
    await db.execute(`INSERT IGNORE INTO Users (username, email, password_hash, role) VALUES
      ('alice123', 'alice@example.com', 'hashed123', 'owner'),
      ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
      ('carol123', 'carol@example.com', 'hashed789', 'owner'),
      ('iluvd0gs', 'iluvd0gs123@example.com', 'hashed321', 'walker'),
      ('ohyeapuppiesiluvem', 'puppies@example.com', 'hashed101', 'owner')`);

    // Insert dogs
    await db.execute(`INSERT IGNORE INTO Dogs (owner_id, name, size) VALUES
      ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
      ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
      ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Rocky', 'large'),
      ((SELECT user_id FROM Users WHERE username = 'ohyeapuppiesiluvem'), 'LuLu', 'medium'),
      ((SELECT user_id FROM Users WHERE username = 'ohyeapuppiesiluvem'), 'Otto', 'small')`);

    // Insert walk requests
    await db.execute(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
      ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-11 07:00:00', 60, 'Botanic Trail', 'open'),
      ((SELECT dog_id FROM Dogs WHERE name = 'LuLu'), '2025-06-15 18:00:00', 60, 'RiverBank Arena', 'open'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Otto'), '2025-07-13 16:15:00', 20, 'Downtown', 'cancelled')`);

    console.log("✅ Full seed data inserted.");
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
  }
}

app.listen(PORT, async () => {
  await seedData();
  console.log(🚀 Server running at http://localhost:${PORT});
});