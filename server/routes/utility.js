import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'

import { ObjectId } from 'mongodb';

const router = express.Router();

// get utility bills for user in household
router.get('/:householdId/:userId', async (req, res) => {
    const { userId, householdId } = req.params;
    if (!userId || !householdId) {
        return res.status(400).json({ message: 'userId and householdId are required' });
    }
    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        const isMember = household.members.some(member => member.toString() === userId);
        if (!isMember) {
            return res.status(403).json({ message: 'User is not a member of this household' });
        }
        const userUtilities = household.utilities.filter(
            utility => utility.owedBy.toString() === userId
        );
        res.status(200).json(userUtilities);
    } catch (error) {
        console.error('Error fetching utilities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// update utility bill as paid for a user
router.patch('/pay/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { userId, category } = req.body;

    if (!userId || !category) {
        return res.status(400).json({ message: 'userId and category are required' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        const utility = household.utilities.find(
            (utility) => utility.owedBy.toString() === userId && utility.category === category
        );

        if (!utility) {
            return res.status(404).json({ message: 'Utility not found for the user and category' });
        }
        utility.paid = true;

        await household.save();

        res.status(200).json({ message: 'Utility marked as paid and amount reset to 0' });
    } catch (error) {
        console.error('Error updating utility:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// reset utility bill
router.patch('/reset/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        household.utilities.forEach((utility) => {
            if (utility.category === category) {
                utility.paid = false;
            }
        });

        await household.save();

        res.status(200).json({ message: 'Utilities reset successfully for all users' });
    } catch (error) {
        console.error('Error resetting utilities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// update amount of utility bill for all users
router.patch('/update-amount/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { category, amount } = req.body;

    if (!category || amount === undefined) {
        return res.status(400).json({ message: 'Category and amount are required' });
    }
    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        household.utilities.forEach((utility) => {
            if (utility.category === category) {
                utility.amount = amount;
            }
        });
        await household.save();
        res.status(200).json({ message: `Utility amounts for category "${category}" updated to ${amount} for all users` });
    } catch (error) {
        console.error('Error updating utility amounts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// hide a bill
router.patch('/hide/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { userId, category } = req.body;

    if (!userId || !category) {
        return res.status(400).json({ message: 'userId and category are required' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        const utility = household.utilities.find(
            (utility) => utility.owedBy.toString() === userId && utility.category === category
        );

        if (!utility) {
            return res.status(404).json({ message: 'Utility not found for the user and category' });
        }

        utility.view = false;
        await household.save();

        res.status(200).json({ message: 'Utility view set to false' });
    } catch (error) {
        console.error('Error updating utility view:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// view a bill
router.patch('/view/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { userId, category } = req.body;

    if (!userId || !category) {
        return res.status(400).json({ message: 'userId and category are required' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        const utility = household.utilities.find(
            (utility) => utility.owedBy.toString() === userId && utility.category === category
        );

        if (!utility) {
            return res.status(404).json({ message: 'Utility not found for the user and category' });
        }

        utility.view = true;
        await household.save();

        res.status(200).json({ message: 'Utility view set to false' });
    } catch (error) {
        console.error('Error updating utility view:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// get usernames who have not paid bill
router.get('/unpaid/:householdId/:category', async (req, res) => {
    const { householdId, category } = req.params;

    try {
        const household = await Household.findById(householdId).populate('members');
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        const unpaidUtilities = household.utilities.filter(
            (utility) => utility.category === category && !utility.paid
        );
        const unpaidUserIds = unpaidUtilities.map((utility) => utility.owedBy);
        const unpaidUsers = await User.find({ _id: { $in: unpaidUserIds } }, 'username');
        const unpaidUsernames = unpaidUsers.map((user) => user.username);

        res.status(200).json(unpaidUsernames);
    } catch (error) {
        console.error('Error fetching unpaid usernames:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;