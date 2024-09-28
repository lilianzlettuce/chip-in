import express from 'express';
import Household from '../models/Household.js';

const router = express.Router();

//get all
router.get('/', async (req, res) => {
  try {
    const households = await Household.find();
    res.status(200).send(households);
  } catch (err) {
    res.status(500).send({err})
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create
router.post("/", async (req, res) => {
  const { members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory } = req.body;

  const newHousehold = new Household({ members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory });

  try {
    await newHousehold.save();
    res.status(201).json(newHousehold);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update by id
router.patch("/:id", async (req, res) => {
  const { members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory } = req.body;

  try {
    const household = await Household.findByIdAndUpdate(req.params.id, { members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory }, { new: true });
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete by id
router.delete("/:id", async (req, res) => {
  try {
    const household = await Household.findByIdAndDelete(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json({ message: "Household deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
