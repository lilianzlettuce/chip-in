import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Sign up 
router.post("/signup", async (req, res) => {
    const user = req.body;
  
    try {
      // Check if valid email and username
      const emailTaken = await User.findOne({email: user.email});
      const usernameTaken = await User.findOne({username: user.username});
  
      if (emailTaken) {
        res.json({ error: "Email already in use." });
      } else if (usernameTaken) {
        res.json({ error: "Username already in use. Be more original." });
      } else {
        // Create user
        user.password = req.body.password;
  
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