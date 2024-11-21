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
        utility.amount = 0;
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

        utility.paid = false;
        utility.amount = 0;

        await household.save();

        res.status(200).json({ message: 'Utility reset successfully' });
    } catch (error) {
        console.error('Error resetting utility:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// update amount of utility bill
router.patch('/update-amount/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { userId, category, amount } = req.body;

    if (!userId || !category || amount === undefined) {
        return res.status(400).json({ message: 'userId, category, and amount are required' });
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

        utility.amount = amount;
        await household.save();

        res.status(200).json({ message: 'Utility amount updated' });
    } catch (error) {
        console.error('Error updating utility amount:', error);
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

export default router;