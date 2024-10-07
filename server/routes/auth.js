import express from 'express';
import User from '../models/User.js';
import PasswordValidator from 'password-validator';

// Create pw schema and add properties
let pwSchema = new PasswordValidator();
pwSchema
.is().min(6)                                    // Minimum length 8
.is().max(25)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least 2 digits
.has().not().spaces();

const router = express.Router();

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
            // Create user
            //user.password = req.body.password;
    
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

export default router;