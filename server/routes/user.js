import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // env variable for email
    pass: process.env.EMAIL_PASS, // env variable for password
  },
});

//get all
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({err})
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create
router.post("/", async (req, res) => {
  const { username, email, password, households, preferences } = req.body;

  const newUser = new User({ username, email, password, households, preferences });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update by id
router.patch("/:id", async (req, res) => {
  const { username, email, password, households, preferences } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { username, email, password, households, preferences }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete by id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forgotpass", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate unique 5-digit code
    const resetCode = generateCode();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error sending email' });
      }

      console.log('Email sent: ' + info.response);
      return res.status(200).send({ message: 'Password reset code sent', code: resetCode });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
});

export default router;
