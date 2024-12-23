import express from 'express';
import Item from '../models/Item.js';
import Household from '../models/Household.js';

const router = express.Router();
import mongoose from 'mongoose';

//delete item by ID from either grocery or purchased list
router.delete('/:listType/:id', async (req, res) => {
  const { listType, id } = req.params;
  const { householdId } = req.query;

  try {
    // Remove item reference from the corresponding household list
    const update = listType === 'grocery' ? { $pull: { groceryList: id } } : { $pull: { purchasedList: id } };

    await Household.findByIdAndUpdate(householdId, update);

    let item;
    if (listType === 'grocery') {
      item = await Item.findByIdAndDelete(id);
    } else {
      item = await Item.findByIdAndUpdate(id, { archived: true });
    }
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// edit item in grocery and purchased list
/*router.patch('/:listType/:id', async(req, res) => {
  const {listType, id} = req.params;
  const { householdId } = req.query;
  const updatedItem = req.body;

  try {
    let fieldsToUpdate;

    if (listType === 'grocery') {
      fieldsToUpdate = {
        name: updatedItem.name,
        category: updatedItem.category,
        purchasedBy: updatedItem.purchasedBy,
        sharedBetween: updatedItem.sharedBetween
      };
    }
    else if (listType === 'purchased') {
      fieldsToUpdate = {
        name: updatedItem.name,
        category: updatedItem.category,
      };
    }
    else {
      return res.status(400).json({ message: "Invalid list type" });
    }

    // avoids overwriting with undefined values
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) delete fieldsToUpdate[key];
    });

    const editedItem = await Item.findByIdAndUpdate (
      { _id: id, householdId: householdId },
      fieldsToUpdate,
      {new: true}
    );

    if (!editedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(editedItem); // update item
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

//create item and add to grocery list
router.post('/addtogrocery', async (req, res) => {
  const { householdId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost, splits } = req.body;

  const newItem = new Item({ name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost, splits });

  try {
    const item = await newItem.save();

    const household = await Household.findByIdAndUpdate(
      householdId,
      { $push: { groceryList: item._id } },
      { new: true, useFindandModify: false }
    );

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create item and add to purchased list
router.post('/addtopurchased', async (req, res) => {
  let { householdId, name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost, splits } = req.body;

  if (!name || !category || !purchasedBy || !purchaseDate || cost === undefined || cost === null) {
    return res.status(400).json({ message: 'Fields must be populated' });
  }

  if (!splits || !Array.isArray(splits) || splits.length === 0) {
    if (!sharedBetween || sharedBetween.length === 0) {
      return res.status(400).json({ message: 'sharedBetween cannot be empty' });
    }
    const defaultSplit = 1 / sharedBetween.length;
    splits = sharedBetween.map(userId => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: `Invalid ObjectId: ${userId}` });
      }
      return {
        member: new mongoose.Types.ObjectId(userId),
        split: defaultSplit
      };
    });
  } else {
    splits = splits.map(split => {
      if (!mongoose.Types.ObjectId.isValid(split.member)) {
        throw new Error(`Invalid ObjectId: ${split.member}`);
      }
      return {
        member: new mongoose.Types.ObjectId(split.member),
        split: split.split !== undefined && split.split !== null ? split.split : 0,
      };
    });
  }

  cost *= 100;

  const newItem = new Item({ name, category, purchasedBy, sharedBetween, purchaseDate, expirationDate, cost, splits });

  try {
    const item = await newItem.save();
    const household = await Household.findByIdAndUpdate(
      householdId,
      { $push: { purchasedList: item._id, purchaseHistory: item._id } },
      { new: true, useFindAndModify: false }
    );

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    for (const split of splits) {
      const splitCost = split.split * cost;
      if (split.member.toString() === purchasedBy) {
        continue;
      }

      await Household.findOneAndUpdate(
        { _id: householdId },
        { $inc: { "debts.$[elem].amount": splitCost } },
        {
          arrayFilters: [{ "elem.owedBy": split.member, "elem.owedTo": purchasedBy }],
          new: true,
          useFindAndModify: false
        }
      );
    }

    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/search/:id', async (req, res) => {
  console.log("search request accepted")
  const purchasedById = req.params.id;
  const userId = req.params.id;
  console.log("purchaser ID:", purchasedById)
  try {
    //const items = await Item.find({ purchasedBy: new ObjectId(purchasedById) });
    const itemsPurchased = await Item.find({ purchasedBy: purchasedById });
    const itemsShared = await Item.find({ sharedBetween: { $in: [userId] } });
    //const items = await Item.find();
    let realcost = 0;

    let splitCostItems = 0;

    let itemCost = [];
    let flag = 0;
    for (let i = 0; i < itemsShared.length; i++) {
      // it's in purchase list, cost of 0 means it has not been purchased yet
      if (itemsShared[i].cost != 0 ) { //&& itemsShared[i].archived == false) {
        //console.log("shared item: ", itemsShared[i].name);
        //totalBought += 1;
        // uneven splits
        let myShare = 0;
        if (itemsShared[i].splits){
          const matchingSplit = itemsShared[i].splits.find(split => split.member.toString() === userId);
          myShare = matchingSplit ? matchingSplit.split : 0;
        }
        else {
          myShare = 1/(itemsShared[i].sharedBetween.length || 1);
        }
        //const numberOfSharers = itemsShared[i].sharedBetween.length || 1;
        realcost += (itemsShared[i].cost / 100) * myShare;
        if (itemsShared[i].archived == false) {
          splitCostItems = (itemsShared[i].cost / 100) * myShare;

          flag = 0;
          for (let j = 0; j < itemCost.length; j++) {
            if (itemCost[j][0] === itemsShared[i].name) {
              itemCost[j][1] += splitCostItems;
              flag = 1;
              break;
            }
          }

          if (flag === 0) {
            itemCost.push([itemsShared[i].name, splitCostItems]);
          }
        }
        
        

      }
    }
    console.log("totalBought: ", itemCost.length);
    let totalBought = itemCost.length;
    res.status(200).send({ totalItems: totalBought, totalCost: realcost, itemBreakdown: itemCost });
  } catch (err) {
    console.log("server db connection error")
    res.status(500).send({ err })
  }
});

//get all
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send({ err })
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
/*router.patch("/:id", async (req, res) => {
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
});*/

router.patch("/editpurchased/:id", async (req, res) => {
  const itemId = req.params.id;
  const { name, category, cost, householdId } = req.body;
  // console.log('cost', cost)
  // console.log('hID', householdId)
  try {
    const originalItem = await Item.findById(itemId);

    if (cost !== null && cost !== undefined && cost !== originalItem.cost) {
      const oldCost = originalItem.cost;
      const newCost = cost;

      // console.log('oldcost', oldCost)
      // console.log('newCost', newCost)

      for (const split of originalItem.splits) {
        const oldSplitCost = split.split * oldCost;
        const newSplitCost = split.split * newCost;
        const costDifference = newSplitCost - oldSplitCost;
        const newHousehold = await Household.findOneAndUpdate(
          { _id: householdId }, // Ensure householdId is associated with the item
          {
            $inc: { "debts.$[elem].amount": costDifference }
          },
          {
            arrayFilters: [
              { "elem.owedBy": split.member, "elem.owedTo": originalItem.purchasedBy }
            ],
            new: true,
            useFindAndModify: false
          }
        );
        // console.log('new debts', newHousehold.debts)
      }
    }

    const item = await Item.findByIdAndUpdate(itemId, { name, category, cost }, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    console.log('error editing item', err)
    res.status(500).json({ error: err.message });
  }
});

router.patch("/editgrocery/:id", async (req, res) => {
  const { name, category, purchasedBy, sharedBetween } = req.body;

  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { name, category, purchasedBy, sharedBetween }, { new: true });
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