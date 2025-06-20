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

            `)
    }

}