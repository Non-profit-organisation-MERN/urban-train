const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests, please try again later' });
    },
});

app.post('/register', limiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        await db.addUser({
            username,
            password,
        });
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
