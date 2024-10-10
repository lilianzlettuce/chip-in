import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const resetCodes = new Map();

//upload pfp
router.patch('/pfp/:id', async (req, res) => {
  const { pfp } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      {pfp},
      {new: true, useFindandModify: false}
    );
    res.status(200).json({msg: "new pfp saved to database"})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({err})
  }
});

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

router.post("/", async (req, res) => {
  const { username, email, password, households, preferences, pfp, bio } = req.body;

  const newUser = new User({ username, email, password, households, preferences, pfp, bio });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { username, email, password, households, preferences, bio } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { username, email, password, households, preferences, bio }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post("/resetpass", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const resetCode = generateCode();
    const expiresAt = Date.now() + 3600000;

    resetCodes.set(email, { resetCode, expiresAt });
    console.log(resetCode + " ");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: " + error);
        return res.status(500).send({ message: 'Error sending email' });
      }

      console.log('Email sent: ' + info.response);
      return res.status(200).send({ message: 'Password reset code sent' });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
});

router.post("/resetcode", async (req, res) => {
  const { email, code, newPassword } = req.body;

  console.log("reset code is : " + code);
  try {
    const resetData = resetCodes.get(email);

    if (!resetData || resetData.resetCode !== Number(code) || Date.now() > resetData.expiresAt) {
      return res.status(400).send({ message: 'Invalid or expired reset code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.password = newPassword;

    await user.save();

    resetCodes.delete(email);

    res.status(200).send({ message: 'Password successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred' });
  }
});

export default router;