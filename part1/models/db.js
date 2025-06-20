const mysql = require('mysql/promise');

const db = mysql.creatPool({
    host: 'localhost',
    user: 'root',
    password: '',
    databse: 'DogWalkService'
});

module.exports = db;