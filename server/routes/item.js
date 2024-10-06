import express from 'express';
import Item from '../models/Item.js';
import Household from '../models/Household.js';

const router = express.Router();

//create item and add to grocery list
router.post('/addtogrocery', async (req, res) => {
  const { householdId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost } = req.body;

  const newItem = new Item({ name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost });

  try {
    const household = await Household.findById(householdId)
    
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const item = await newItem.save();

    household.groceryList.push(item._id)
    await household.save()
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create item and add to purchased list
router.post('/addtopurchased', async (req, res) => {
  const { householdId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost } = req.body;

  if (!name || !category || !purchaseDate || !expirationDate || cost === undefined || cost === null) {
    return res.status(400).json({ message: 'All fields must be populated' });
  }

  const newItem = new Item({ name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost });

  try {
    const household = await Household.findById(householdId)
    
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const item = await newItem.save();
    
    household.purchasedList.push(item._id)
    await household.save()
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send({err})
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create
router.post("/", async (req, res) => {
  const { name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost } = req.body;

  const newItem = new Item({ name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update by id
router.patch("/:id", async (req, res) => {
  const { name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost } = req.body;

  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost }, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete by id
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
