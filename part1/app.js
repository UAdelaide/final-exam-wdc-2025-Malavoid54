const express = require('express');
const apiRoutes = require('./routes/api');
const db = require('./models/db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('./api', apiRoutes);

async function seedData() {
    try {
        await db.execute(`INSERT IGNORE INTO Users (Username, EmailUser, PasswordHash, RoleUser) VALUES
             ('alice123', 'alice@example.com', 'hashed123', 'owner'),
             ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
             ('carol123', 'carol@example.com', 'hashed789', 'owner'),
             ('iluvd0gs', 'iluvd0gs123@example.com', 'hashed321', 'walker'),
             ('ohyeapuppiesiluvem', 'puppies@example.com', 'hashed101', 'owner')
        `);
        await db.execute(`INSERT IGNORE INTO Dogs (OwnerID, DogName, DogSize) VALUES
            ((SELECT UserID FROM Users WHERE Username = 'alice123'), 'Max', 'medium'),
            ((SELECT UserID FROM Users WHERE Username = 'carol123'), 'Bella', 'small'),
            ((SELECT UserID FROM Users WHERE Username = 'alice123'), 'Rocky', 'large'),
            ((SELECT UserID FROM Users WHERE Username = 'ohyeapuppiesiluvem'), 'LuLu', 'medium'),
            ((SELECT UserID FROM Users WHERE Username = 'ohyeapuppiesiluvem'), 'Otto', 'small')
        `);
        await db.execute(`INSERT IGNORE INTO WalkRequests (DogID, RequestTime, WalkDuration, WalkLocation, WalkStatus) VALUES
            ((SELECT DogID FROM Dogs WHERE DogName = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
            ((SELECT DogID FROM Dogs WHERE DogName = 'Max'), '2025-06-10 08:00:00', 45, 'Beachside Ave', 'accepted'),
            ((SELECT DogID FROM Dogs WHERE DogName = 'Max'), '2025-06-10 08:00:00', 60, 'Botanic Trail', 'open'),
            ((SELECT DogID FROM Dogs WHERE DogName = 'Max'), '2025-06-10 08:00:00', 60, 'RiverBank Arena', 'open'),
            ((SELECT DogID FROM Dogs WHERE DogName = 'Max'), '2025-06-10 08:00:00', 20, 'Downtown', 'cancelled')
            `);
        console.log("Full seed data inserted.");
    } catch (err) {
        console.error("Error inserting seed data:", err);
    }
}
app.listen(PORT, async () => {
    await seedData();
    console.log(``)
});