import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'
import Item from '../models/Item.js'
import mongoose from 'mongoose';


const router = express.Router();

//get debts
router.get('/debts/:id', async (req, res) => {
    const householdId = req.params.id;

    try {
        const household = await Household.findById(householdId).populate({
            path: 'debts',
            populate: [
                {
                    path: 'owedBy',
                    select: 'username'
                },
                {
                    path: 'owedTo',
                    select: 'username'
                }
            ]
        });
        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }
        res.status(200).json(household.debts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//pay entire debt
router.patch('/payall/:id', async (req, res) => {
    const householdId = req.params.id;
    const { owedById, owedToId } = req.body;

    try {
        const owedBy = await User.findById(owedById);
        const owedTo = await User.findById(owedToId);

        let household = await Household.findOneAndUpdate(
            {
              _id: householdId
            },
            {
              $set: { "debts.$[elem].amount": 0 },
              $push: { alerts: {
                category: 'Payment',
                content: `${owedBy.username} paid ${owedTo.username} back in full!`,
                recipients: [owedToId],
                date: new Date()
              }}
            },
            {
              arrayFilters: [
                { "elem.owedBy": owedById, "elem.owedTo": owedToId }
              ],
              new: true,
              useFindAndModify: false
            }
        ); 
        if (!household) {
          return res.status(404).json({ message: "Household not found" });
        }
        res.status(200).json(household.debts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//pay partial debt
router.patch('/partialpay/:id', async (req, res) => {
    const householdId = req.params.id;
    const { owedById, owedToId, amount } = req.body;

    try {
        const owedBy = await User.findById(owedById);
        const owedTo = await User.findById(owedToId);

        let household = await Household.findOneAndUpdate(
            {
                _id: householdId
            },
            {
                $inc: { "debts.$[elem].amount": -amount },
                $push: { alerts: {
                  category: 'Payment',
                  content: `${owedBy.username} paid ${owedTo.username} back \$${(amount / 100).toFixed(2)}!`,
                  recipients: [owedToId],
                  date: new Date()
                }}
            },
            {
                arrayFilters: [
                    { "elem.owedBy": owedById, "elem.owedTo": owedToId }
                ],
                new: true,
                useFindAndModify: false
            }
        ); 
        if (!household) {
          return res.status(404).json({ message: "Household not found" });
        }
        res.status(200).json(household.debts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;