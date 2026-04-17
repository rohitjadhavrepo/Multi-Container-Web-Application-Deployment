const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MySQL
const db = mysql.createConnection({
    host: 'host.docker.internal',   // IMPORTANT for Docker
    user: 'rohit',
    password: 'password',
    database: 'yourDatabaseName'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create table (same purpose as Mongoose model)
db.query(`CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255)
)`);

// Middleware (same as before)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes (same structure, logic changed internally)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', (req, res) => {
    const { email } = req.body;

    db.query('INSERT INTO emails (email) VALUES (?)', [email], (err) => {
        if (err) {
            res.status(500).send('Error adding email');
            return;
        }
        res.redirect('/');
    });
});

app.get('/emails', (req, res) => {
    db.query('SELECT * FROM emails', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching emails');
            return;
        }
        res.json(results);
    });
});

app.get('/exit', (req, res) => {
    res.send('Server stopped');
    process.exit(0);
});

// Start server (same)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
