import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'
import Item from '../models/Item.js'
import mongoose from 'mongoose';

import { ObjectId } from 'mongodb';

const router = express.Router();

// Search for items within a specific household based on the item name
router.get('/:householdId/search', async (req, res) => {
  const { householdId } = req.params;
  const { name } = req.query;

  try {
    const household = await Household.findById(householdId).populate({
      path: 'groceryList purchasedList',
      populate: [
        {
          path: 'purchasedBy',
          select: 'username'
        },
        {
          path: 'sharedBetween',
          select: 'username'
        }
      ]
    });

    const matchedGroceryItems = household.groceryList.filter(item =>
      new RegExp(name, 'i').test(item.name)
    );
    const matchedPurchasedItems = household.purchasedList.filter(item =>
      new RegExp(name, 'i').test(item.name)
    );

    const itemsWithListType = [
      ...matchedGroceryItems.map(item => ({ ...item.toObject(), listType: 'grocery' })),
      ...matchedPurchasedItems.map(item => ({ ...item.toObject(), listType: 'purchased' }))
    ];

    res.status(200).json(itemsWithListType);
  } catch (err) {
    console.error('Error searching items:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// // POST route to update household members
// router.patch('/updateMembers/:id', async (req, res) => {
//   const { userId } = req.body; // Expect _id of household and userId to add
//   try {
//     // Find the household and update members
//     const household = await Household.findByIdAndUpdate(
//       req.params.id,
//       { $addToSet: { members: userId } },
//       { new: true, useFindAndModify: false } // Return the updated document
//     );

//     res.status(200).json({ msg: "new user added to household" })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }

// });

//move from purchased to grocery
router.patch('/repurchase', async (req, res) => {
  const { householdId, itemId } = req.body;

  try {
    const oldItem = await Item.findById(itemId);

    const newItem = new Item({ name: oldItem.name, category: oldItem.category });

    const savedItem = await newItem.save();

    const household = await Household.findByIdAndUpdate(
      householdId,
      { $push: { groceryList: savedItem._id } },
      { new: true, useFindAndModify: false }
    );

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//move from grocery to purchased
router.patch('/purchase', async (req, res) => {
  let { householdId, itemId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, splits, cost } = req.body;

  if (!purchasedBy || !purchaseDate || !purchasedBy || cost == undefined || cost == null) {
    return res.status(400).json({ message: 'Fields must be populated' });
  }
  cost *= 100;

  try {
    const currItem = await Item.findById(itemId);

    if ((!splits || splits.length == 0) && currItem.sharedBetween.length == 0) {
      if (!sharedBetween && sharedBetween.length == 0) {
        return res.status(400).json({ message: 'sharedBetween cannot be empty' })
      }
      const defaultSplit = 1 / sharedBetween.length;
      splits = sharedBetween.map(userId => ({
        member: userId,
        split: defaultSplit
      }));
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        purchasedBy,
        purchaseDate,
        ...(sharedBetween && { sharedBetween }),
        ...(expirationDate && { expirationDate }),
        cost,
      },
      { new: true, runValidators: true }
    );

    const household = await Household.findByIdAndUpdate(
      householdId,
      {
        $pull: { groceryList: updatedItem._id },
        $push: { purchasedList: updatedItem._id, purchaseHistory: updatedItem._id }
      },
      { new: true, useFindAndModify: false }
    );

    for (const split of splits) {
      const splitCost = split.split * cost;
      // console.log(splitCost)
      // console.log('split.member', split.member)
      // console.log('purchasedby', purchasedBy)
      if (split.member === purchasedBy) {continue;}
      let newHousehold = await Household.findOneAndUpdate(
        {
          _id: householdId
        },
        {
          $inc: { "debts.$[elem].amount": splitCost }
        },
        {
          arrayFilters: [
            { "elem.owedBy": split.member, "elem.owedTo": purchasedBy }
          ],
          new: true,
          useFindAndModify: false
        }
      );   
    }

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(201).json(updatedItem);
  } catch (err) {
    console.log('error moving grocery to purchased', err)
    res.status(500).json({ error: err.message });
  }
});

//get all
router.get('/', async (req, res) => {
  try {
    const households = await Household.find();
    res.status(200).send(households);
  } catch (err) {
    res.status(500).send({ err })
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

//get roommates from household
router.get("/members/:id", async (req, res) => {
  try {
    const household = await Household.findById(req.params.id).populate('members');
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//create
router.post("/", async (req, res) => {
  const { name, members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory } = req.body;

  const newHousehold = new Household({ name, members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory });

  for (const memberId of members) {
    await User.findByIdAndUpdate(memberId, { $push: { households: newHousehold._id } });
  }

  try {
    await newHousehold.save();
    res.status(201).json(newHousehold);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update by id
router.patch("/:id", async (req, res) => {
  const { name, members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory } = req.body;

  try {
    const household = await Household.findByIdAndUpdate(req.params.id, { name, members, groceryList, purchasedList, debts, alerts, notes, recipes, purchaseHistory }, { new: true });
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

//add user to household
router.post("/addUser/:id", async (req, res) => {
  const { userId } = req.body;
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

    // check to make sure that user is not in household
    if (user.households.some(household => household.equals(new mongoose.Types.ObjectId(householdId)))) {
      console.log("User is already in the household");
      return res.status(400).json({ message: 'User is already in the household' });
    }

    // add household to user
    const newUser = await User.findByIdAndUpdate(
      userId,
      { $push: { households: householdId } },
      { new: true, useFindAndModify: false }
    );

    //create new debts
    let newDebts = [];
    for (let i = 0; i < household.members.length; i++) {
      newDebts.push({
        owedBy: userId,
        owedTo: household.members[i],
        amount: 0
      });
      newDebts.push({
        owedBy: household.members[i],
        owedTo: userId,
        amount: 0
      });
    }
    
    const newHousehold = await Household.findByIdAndUpdate(
      householdId,
      { $push: { 
          members: userId,
          debts: { $each: newDebts }
        } 
      },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(newHousehold);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get grocery list
router.get("/:id/grocerylist", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate({
      path: 'groceryList',
      populate: [
        {
          path: 'purchasedBy',
          select: 'username'
        },
        {
          path: 'sharedBetween',
          select: 'username'
        }
      ]
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(household.groceryList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get purchased list
router.get("/:id/purchasedlist", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate({
      path: 'purchasedList',
      populate: [
        {
          path: 'purchasedBy',
          select: 'username'
        },
        {
          path: 'sharedBetween',
          select: 'username'
        },
        {
          path: 'splits.member',
          select: 'username'
        }
      ]
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const modifiedPurchasedList = household.purchasedList.map(item => {
      return {
        ...item._doc, // Spread other fields of the item
        cost: item.cost / 100 // Divide the cost by 100
      };
    });

    res.status(200).json(modifiedPurchasedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all items in purchase history
router.get("/:id/purchaseHistory", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate({
      path: 'purchaseHistory',
      populate: [
        {
          path: 'purchasedBy',
          select: 'username'
        },
        {
          path: 'sharedBetween',
          select: 'username'
        }
      ]
    });
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Sort items in ascending order by date
    household.purchaseHistory.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

    res.status(200).json(household.purchaseHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get expenditure per month
router.get("/:id/expenditurePerMonth", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate('purchaseHistory');
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Process data to group expenditures by month
    const expenditureByMonth = household.purchaseHistory.reduce((acc, item) => {
      // Convert purchaseDate to a "YYYY-MM" string
      const purchaseDate = new Date(item.purchaseDate);
      const month = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;

      // Accumulate cost for this month
      acc[month] = (acc[month] || 0) + (item.cost / 100);

      return acc;
    }, {});

    // Sort keys chronologically
    const sortedKeys = Object.keys(expenditureByMonth).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Create sorted map from sorted keys
    const sortedExpenditures = {};
    sortedKeys.forEach(key => {
      sortedExpenditures[key] = expenditureByMonth[key];
    });

    // Separate data into Chart.js compatible arrays
    let labels = Object.keys(sortedExpenditures);
    let data = Object.values(sortedExpenditures);

    // Reformat labels
    labels = labels.map(label => {
      const [year, month] = label.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", { month: "long", year: "numeric" });
    });

    res.status(200).json({ labels, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// get expenses by category
router.get("/:id/expensesByCategory", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate('purchaseHistory');
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Process data to group expenditures by category
    const expensesByCategory = household.purchaseHistory.reduce((acc, item) => {
      const category = item.category;

      // Accumulate cost for this category
      acc[category] = (acc[category] || 0) + (item.cost / 100);

      return acc;
    }, {});

    // Create array sorted by expense value 
    let sortedExpenses = [];
    for (let cat in expensesByCategory) {
      sortedExpenses.push([cat, expensesByCategory[cat]]);
    }
    sortedExpenses.sort((a, b) => {
      return b[1] - a[1];
    });

    // Separate data into Chart.js compatible arrays
    let labels = sortedExpenses.map(exp => exp[0]);
    let data = sortedExpenses.map(exp => exp[1]);

    res.status(200).json({ labels, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// get expenses by item
router.get("/:id/expensesByItem", async (req, res) => {
  const id = req.params.id;

  try {
    const household = await Household.findById(id).populate('purchaseHistory');
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    /* Expenses */

    // Process data to group expenses by item name
    const expensesByItem = household.purchaseHistory.reduce((acc, item) => {
      // Convert to lower case
      const name = item.name.toLowerCase().trim();

      // Accumulate cost for this item
      acc[name] = (acc[name] || 0) + (item.cost / 100);
      return acc;
    }, {});

    // Create array sorted by expense value 
    let sortedExpenses = [];
    for (let item in expensesByItem) {
      sortedExpenses.push([item, expensesByItem[item]]);
    }
    sortedExpenses.sort((a, b) => {
      return b[1] - a[1];
    });

    // Separate data into Chart.js compatible arrays
    let expenseLabels = sortedExpenses.map(exp => exp[0]);
    let expenseData = sortedExpenses.map(exp => exp[1]);

    /* Frequencies */

    // Process data to group frequencies by item name
    const freqsByItem = household.purchaseHistory.reduce((acc, item) => {
      // Convert to lower case
      const name = item.name.toLowerCase().trim();

      // Accumulate cost for this item
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    // Create array sorted by expense value 
    let sortedFreqs = [];
    for (let item in freqsByItem) {
      sortedFreqs.push([item, freqsByItem[item]]);
    }
    sortedFreqs.sort((a, b) => {
      return b[1] - a[1];
    });

    // Separate data into Chart.js compatible arrays
    let freqLabels = sortedFreqs.map(freq => freq[0]);
    let freqData = sortedFreqs.map(freq => freq[1]);

    // Format data to send as result
    res.status(200).json({ 
      expenses: {
        labels: expenseLabels, 
        data: expenseData
      },
      frequencies: {
        labels: freqLabels, 
        data: freqData
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// leave household
router.post("/leave/:id", async (req, res) => {
  const { userId } = req.body;
  const householdId = req.params.id;

  try {
    let household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!household.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this household' });
    }

    await Household.updateOne(
      { _id: householdId },
      { 
        $pull: { 
          members: userId,
          debts: { 
            $or: [ 
              { owedBy: userId }, 
              { owedTo: userId } 
            ] 
          }
        } 
      }
    );

    // Remove household from user's household list
    await User.updateOne(
      { _id: userId },
      { $pull: { households: householdId } }
    );
    household = await Household.findById(householdId);
    // If the last member leaves, delete the household
    if (household.members.length === 0) {
      await Household.findByIdAndDelete(householdId);
      return res.status(200).json({ message: 'Household deleted as the last member left' });
    } else {
      return res.status(200).json({ message: 'User successfully removed from household' });
    }

  } catch (err) {
    console.log('error leaving household', err)
    res.status(500).json({ error: err.message });
  }
});

router.get('/owed/:id', async (req, res) => {
  console.log("search request accepted")
  const userId = req.params.id;
  //console.log("purchaser ID:", userId)
  try {
    const households = await Household.find();
    let cost = 0;
    let totalOwedTo = 0;
    let totalOwedBy = 0;
    for (let i = 0; i < households.length; i++) {
      for (let j = 0; j < households[i].debts.length; j++){
        if (households[i].debts[j].owedBy == userId){
          totalOwedBy += households[i].debts[j].amount;
        }
        if (households[i].debts[j].owedTo == userId){
          totalOwedTo += households[i].debts[j].amount;
          //console.log("Total owed to Amount:", totalOwedTo);
        }
      }
    }

    totalOwedBy = totalOwedBy / 100;
    totalOwedTo = totalOwedTo / 100;
    res.status(200).send({ totalOwedTo: totalOwedTo, totalOwedBy: totalOwedBy });
  } catch (err) {
    console.log("server db connection error")
    res.status(500).send({ err })
  }
});
export default router;