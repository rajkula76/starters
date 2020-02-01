// Required dependencies
const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

// cookieSession config
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['somerandomstuffhere']
}));

/**
 * PASSPORT
 */
app.use(passport.initialize());
app.use(passport.session());

// Strategy config
passport.use(new GoogleStrategy({
    clientID: 'MY_GOOGLE_CLIENT_ID',
    clientSecret: 'MY_CLIENT_SECRET_ID',
    callbackURL: 'http://localhost:8000/auth/google/callback'
},
    (accessToken, refreshTokken, profile, done) => {
        done(null, profile);    // passes the profile data to serializeUser
    }
));

// Place informations into cookie
passport.serializeUser((user, done) => {
    done(null, user);
});
// Decode received cookie
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next){
    if (req.user) {
        next();
    } else {
        res.json({
            message: 'Please login first.'
        });
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Sending request to google
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}))
// Receiving data from google
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/secret');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
    res.json({
        message: 'You can see secret stuff...'
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(8000, () => {
    console.log('Server started on port 8000');
});