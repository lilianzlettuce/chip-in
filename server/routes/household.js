import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'
import Item from '../models/Item.js'

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
// router.patch("/:id", async (req, res) => {
//   const { members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory } = req.body;

//   try {
//     const household = await Household.findByIdAndUpdate(req.params.id, { members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory }, { new: true });
//     if (!household) {
//       return res.status(404).json({ message: "Household not found" });
//     }
//     res.status(200).json(household);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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

//add user to household
router.post("/addUser/:id", async (req, res) => {
    const {userId} = req.body;
    const householdId = req.params.id;

    try {
        // find household
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        
        // find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // add household to user
        user.households.push(householdId);

        // create new debts
        for (let i = 0; i < household.members.length; i++) {
            household.debts.push({
                owedBy: userId,
                owedTo: household.members[i],
                amount: 0
            });
            household.debts.push({
                owedBy: household.members[i],
                owedTo: userId,
                amount: 0
            });
        }

        // add user to household members list
        household.members.push(userId);

        // update documents
        await user.save();
        await household.save();

        res.status(200).json(household);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get grocery list
router.get("/:id/grocerylist", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate('groceryList');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(household.groceryList);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// get purchased list
router.get("/:id/purchasedlist", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate('purchasedList');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(household.purchasedList);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});
export default router;

//move from grocery to purchased
router.patch('/purchase', async (req, res) => {
  const { householdId, itemId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost } = req.body;

  if (!purchasedBy || !purchaseDate || cost == undefined || cost == null) {
    return res.status(400).json({ message: 'Fields must be filled' });
  }
  console.log(itemId)
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        purchasedBy,
        purchaseDate,
        ...(sharedBetween && {sharedBetween}),
        ...(expirationDate && {expirationDate}),
        cost,
      },
      {new: true, runValidators: true}
    );

    const household = await Household.findByIdAndUpdate(
      householdId,
      {
        $pull: {groceryList: updatedItem._id},
        $push: {purchasedList: updatedItem._id}
      },
      {new: true, useFindandModify: false}
    );
    
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    
    res.status(201).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});