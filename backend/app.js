require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173';

// Middleware setup
app.use(cors({
    origin: frontendUrl,
    credentials: true,
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
        sameSite: 'none', // Required for cross-origin cookies
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
    },
}));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose connection setup with increased timeouts
mongoose.set('bufferCommands', false);  // Disable buffering to catch errors early
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,           // Increase socket timeout to 45 seconds
}).catch(err => {
    console.error("MongoDB connection error: ", err);
});

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await User.register(new User({ username, email }), password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/login', (req, res, next) => {
    console.log("Login attempt:", req.body);  // Log login attempt data

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.status(500).json({ message: "Login failed due to server error" });
        }

        if (!user) {
            console.log("Authentication failed. User not found or incorrect credentials.");
            return res.status(401).json({ message: "Login failed. Please try again." });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Error during session login:", err);
                return res.status(500).json({ message: "Login failed during session setup" });
            }

            console.log("User authenticated:", user);
            return res.status(200).json({ message: "User logged in successfully", user });
        });
    })(req, res, next);
});

app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json(req.user);
    }
    res.status(401).json({ message: "User not authenticated" });
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout failed:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        res.status(200).json({ message: "Logout Successful" });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
