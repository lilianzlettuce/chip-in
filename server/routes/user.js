import express from 'express';
import User from '../models/User.js';

const router = express.Router();

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
  const { username, email, password, households, preferences, pfp, bio } = req.body;

  const newUser = new User({ username, email, password, households, preferences, pfp, bio });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update by id
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

export default router;