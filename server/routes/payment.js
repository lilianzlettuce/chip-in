import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'
import Item from '../models/Item.js'
import mongoose from 'mongoose';


const router = express.Router();

//get debts
// router.get('/debts/:id', async (req, res) => {
//     const householdId = req.params.id;

//     try {
//         const household = await Household.findById(householdId).populate({
//             path: 'debts',
//             populate: [
//                 {
//                     path: 'owedBy',
//                     select: 'username'
//                 },
//                 {
//                     path: 'owedTo',
//                     select: 'username'
//                 }
//             ]
//         });
//         if (!household) {
//             return res.status(404).json({ message: "Household not found" });
//         }
//         res.status(200).json(household.debts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// get debts
router.patch('/debts/:id', async (req, res) => {
    const householdId = req.params.id;

    try {
        const household = await Household.findById(householdId).populate({
            path: 'debts',
            populate: [
                { path: 'owedBy', select: 'username' },
                { path: 'owedTo', select: 'username' }
            ]
        });

        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }
        const debtsMap = new Map();
        household.debts.forEach((debt) => {
            const owedById = debt.owedBy._id.toString();
            const owedToId = debt.owedTo._id.toString();
            const debtKey = `${owedById}-${owedToId}`;
            debtsMap.set(debtKey, debt);
        });

        const processedKeys = new Set();

        // Iterate over each debt to balance
        for (let debt of household.debts) {
            const owedById = debt.owedBy._id.toString();
            const owedToId = debt.owedTo._id.toString();
            const debtKey = `${owedById}-${owedToId}`;
            const reverseDebtKey = `${owedToId}-${owedById}`;

            if (processedKeys.has(debtKey) || processedKeys.has(reverseDebtKey)) {
                continue;
            }
            const reverseDebt = debtsMap.get(reverseDebtKey);

            if (reverseDebt) {
                const amountDifference = debt.amount - reverseDebt.amount;

                console.log("Processing debts between:", owedById, "and", owedToId);
                console.log("Original debt amounts:", debt.amount, reverseDebt.amount);
                console.log("Amount difference:", amountDifference);

                let debtAmount = 0;
                let reverseDebtAmount = 0;

                if (amountDifference > 0) {
                    debtAmount = amountDifference;
                    reverseDebtAmount = 0;
                } else if (amountDifference < 0) {
                    debtAmount = 0;
                    reverseDebtAmount = -amountDifference;
                }

                await Household.findOneAndUpdate(
                    { _id: householdId },
                    {
                        $set: {
                            "debts.$[debt].amount": debtAmount,
                            "debts.$[reverseDebt].amount": reverseDebtAmount
                        }
                    },
                    {
                        arrayFilters: [
                            { "debt.owedBy": new mongoose.Types.ObjectId(owedById), "debt.owedTo": new mongoose.Types.ObjectId(owedToId) },
                            { "reverseDebt.owedBy": new mongoose.Types.ObjectId(owedToId), "reverseDebt.owedTo": new mongoose.Types.ObjectId(owedById) }
                        ],
                        new: true,
                        useFindAndModify: false
                    }
                );

                processedKeys.add(debtKey);
                processedKeys.add(reverseDebtKey);
            }
        }
        const updatedHousehold = await Household.findById(householdId).populate({
            path: 'debts',
            populate: [
                { path: 'owedBy', select: 'username' },
                { path: 'owedTo', select: 'username' }
            ]
        });
        console.log("Updated debts:", updatedHousehold.debts);
        res.status(200).json(updatedHousehold.debts);
    } catch (err) {
        console.error(err);
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
                $push: {
                    alerts: {
                        category: 'Payment',
                        content: `${owedBy.username} paid ${owedTo.username} back in full!`,
                        recipients: [owedToId],
                        date: new Date()
                    }
                }
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
                $push: {
                    alerts: {
                        category: 'Payment',
                        content: `${owedBy.username} paid ${owedTo.username} back \$${(amount / 100).toFixed(2)}!`,
                        recipients: [owedToId],
                        date: new Date()
                    }
                }
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

//return item
router.patch('/return/:id', async (req, res) => {
    console.log('return')
    const householdId = req.params.id;
    const { itemId } = req.body;
    console.log(itemId)
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        console.log('purchasedby', item.purchasedBy);

        for (const split of item.splits) {
            const splitCost = split.split * item.cost;
            // console.log(splitCost)
            // console.log('split.member', split.member)
            // console.log('purchasedby', purchasedBy)
            if (split.member === item.purchasedBy) { continue; }
      
            let newHousehold = await Household.findOneAndUpdate(
                {
                    _id: householdId
                },
                {
                    $inc: { "debts.$[elem].amount": splitCost }
                },
                {
                    arrayFilters: [
                    { "elem.owedBy": item.purchasedBy, "elem.owedTo": split.member }
                    ],
                    new: true,
                    useFindAndModify: false
                }
            );
        }

        let household = await Household.findByIdAndUpdate(
            householdId,
            {
                $pull: {
                    purchasedList: itemId,
                    purchaseHistory: itemId,
                },
            },
            { new: true }
        );

        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }

        await Item.findByIdAndDelete(itemId);

        res.status(200).json(household.debts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;