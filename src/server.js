const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const User = require('./db');
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
        const { email, password } = req.body;
        const saltRounds = 10;
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Internal Server Error');
            }
            await db.addUser({
                email,
                password: hashedPassword,
            });
            console.log('User saved successfully');
            console.log('User email:', email);
            console.log('Original password:', password);
            return res.send('<script>alert("Register Successful, Please login"); window.location.href = "http://localhost:3000/login";</script>');
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

let lockoutToken = null;
app.post('/login', async (req, res) => {
    try {
        if (lockoutToken) {
            console.log('Another user is already logged in');
            return res.status(200).json({ message: 'Another user is already logged in' });
        }

        const { email, password } = req.body;
        const user = await db.findUserByEmail(email);

        if (!user) {
            console.log('Invalid email or password');
            return res.status(200).json({ message: 'Invalid email' });
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            } else if (result) {
                lockoutToken = { user: user.email, timestamp: Date.now() };
                res.cookie('lockoutToken', lockoutToken.timestamp, { maxAge: 36000000 });
                console.log('Login successful');
                res.status(200).json({ message: 'Login successful' });
            } else {
                console.log('Invalid password');
                return res.status(200).json({ message: 'Invalid password' });
            }
        });
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/protected', verifyToken, (req, res) => {
    res.send('Protected route');
});

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send('Unauthorized');
    } else {
        jwt.verify(token, 'secret-key', (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).send('Token expired, please log in again');
                    console.log('expired');
                } else {
                    res.status(401).send('Unauthorized');
                }
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}

app.post('/logout', (req, res) => {
    if (!lockoutToken) {
        console.log('No user found to logout');
        return res.status(200).json({ message: 'No user found to logout' });
    }

    lockoutToken = null;
    res.clearCookie('lockoutToken');
    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
