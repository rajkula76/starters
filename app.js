const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'vipuser',
        email: 'fts@something.com'
    };

    // async authorization
    jwt.sign({ user }, 'somesecretword', { expiresIn: '30s' }, (err, token) => {
        // expiresIn must be STRING in form 30s (30 seconds), '2 days', '10h'
        res.json({
            token
        });
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: '[GET] - API rout works'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'somesecretword', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: '[POST] - See all that posts',
                authData
            });
        }
    });
});

app.post('/api/users', verifyToken, (req, res) => {
    jwt.verify(req.token, 'somesecretword', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: '[POST] - Show some users',
                authData
            });
        }
    });
});


// Functions
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        // TOKEN FORMAT
        // Authorization: Bearer <access_token>
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        // Set token
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server on port 5000'));