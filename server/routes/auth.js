import express, { application } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PasswordValidator from 'password-validator';

import googleAuth from '../controllers/authController.js';

import User from '../models/User.js';

// Create pw schema and add properties
let pwSchema = new PasswordValidator();
pwSchema // uncomment for deployment
/*.is().min(6)                                    // Minimum length
.is().max(25)                                  // Maximum length
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have digits
.has().not().spaces();*/

const router = express.Router();

// Log in with Google auth
router.get("/google", googleAuth);

// Sign up 
router.post("/signup", async (req, res) => {
    const user = req.body;
  
    try {
        // Check if valid email, username, and password
        const emailTaken = await User.findOne({email: user.email});
        const usernameTaken = await User.findOne({username: user.username});
        const passwordValid = pwSchema.validate(user.password);
    
        if (emailTaken) {
            res.json({ error: "Email already in use." });
        } else if (usernameTaken) {
            res.json({ error: "Username already in use. Be more original." });
        } else if (!passwordValid) {
            let pwDetails = pwSchema.validate(user.password, { details: true });
            let pwError = "Password must" + pwDetails[0].message.substring(17);
            res.json({ error: pwError});
        } else {
            // Create user with hashed password
            user.password = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                email: user.email,
                username: user.username,
                password: user.password
            })
    
            newUser.save();
            res.status(201).json({message: "Account created successfully."});
        }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Log in
router.post("/login", (req, res) => {
    // Get user info submitted by user logging in
    const user = req.body;

    // Try to find matching username in database
    User.findOne({username: user.username})
    .then(dbUser => {
        // Return error if user not found
        if (!dbUser) {
            return res.json({ error: "User does not exist."});
        }
        // Compare matched user passwords
        bcrypt.compare(user.password, dbUser.password)
        .then(pwCorrect => {
            // Verify correct password
            if (pwCorrect || user.password == dbUser.password) {
                // Current user info that will be encoded into token
                const payload = {
                    id: dbUser._id,
                    username: dbUser.username,
                    email: dbUser.email,
                    households: dbUser.households,
                    preferences: dbUser.preferences,
                }
                console.log("user info:")
                console.log(payload);

                // Create token and send to frontend
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400}, // 1 day
                    (err, token) => {
                        if (err) return res.json({ error: err });

                        return res.json({
                            message: "Success",
                            token: token, //"Bearer " + token,
                            id: dbUser._id,
                        });
                    }
                );
            } else {
                return res.json({ error: "Invalid Password" });
            }
        });
    })
});

// Verify user's current password
router.post("/verify-password", async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error verifying password:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

// Check if user is logged in and access current user's data
router.get("/getUserData", verifyJWT, (req, res) => {
    res.json({
        isLoggedIn: true,
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        households: req.user.households,
        preferences: req.user.preferences,
    })
})

// Check if user is authorized to access a route
function verifyJWT(req, res, next) {
    console.log("in verify jwt")
    const token = req.headers["x-access-token"]; //?.split(' ')[1];
    console.log(token)

    // Verify given token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) console.log("jwt error", err);
            if (err) return res.json({
                isLoggedIn: false,
                error: "Failed to Authenticate",
            });

            // User data object to be passed back
            req.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
                households: decoded.households,
                preferences: decoded.preferences,
            };

            console.log("req.user: ", req.user)

            next();
        });
    } else {
        console.log("incorrect token")
        res.json({
            error: "Incorrect token given",
            isLoggedIn: false,
        });
    }
}

export default router;