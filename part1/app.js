const express = require('express');
const apiRoutes = require('./routes/api');
const db = require('./models/db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('./api', apiRoutes);

async function seedData() {
    try {
        await 
    }

}