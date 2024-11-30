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
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
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
    },
}))

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGO_URL)

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await User.register(new User({ username, email }), password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(201).json({ message: "User Logged in" })
});

app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json(req.user)
    }
    res.status(401).json({ message: "User not authenticated" })
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return res.status(500).json({ message: "Logout failed" }) }
        res.status(200).json({ message: "Logout Successful" })
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))