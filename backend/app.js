require('dotenv').config()

const express = require('express')
const app = express()
const session = require('express-session');
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const cors = require('cors');

const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173';

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.error("ERROR in MONGO SESSION STORE", err);
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    },
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

// Login Route
app.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    res.send({ message: "Logged in successfully" });
});

// User Route
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ user: req.user });
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    req.logout();
    res.send({ message: "Logged out" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
