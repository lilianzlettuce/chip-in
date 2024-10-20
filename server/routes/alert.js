import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'
import Item from '../models/Item.js'

const router = express.Router();

//get all alerts for a household
router.get('/:id', async (req, res) => {
    const householdId = req.params.id;
    try {
        const household = await Household.findById(householdId);
        
        res.status(200).send(household.alerts);
    } catch (err) {
        res.status(500).send({err})
    }
});

router.post('/nudge', async (req, res) => {
    let {householdId, nudgerId, recipientId, message, amount} = req.body;
    const currentDate = new Date();

    console.log('nudge')
    try {
        const nudger = await User.findById(nudgerId);
        console.log(nudger.username)
        if (!nudger) {
            return res.status(404).send({ error: `Nudger not found`})
        }
        if (!message) {
            message = `Friendly reminder from ${nudger.username} to pay them back!` 
        }
        const newAlert = {
            category: 'Nudge',
            content: message,
            recipients: recipientId,
            date: currentDate
        }
        
        const household = await Household.findByIdAndUpdate(householdId, { $push: {alerts: newAlert}})
        if (!household) {
            return res.status(404).send({ error: `Household with id ${householdId} not found` });
        }

        console.log(household)
        res.status(201).send(newAlert)
    } catch (err) {
        console.error('Error:', err); 
        res.status(500).send({err})
    } 
});
export default router;