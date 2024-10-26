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

//get user relevant alerts for a household
router.get('/:householdID/:userID', async (req, res) => {
    const householdId = req.params.householdID;
    const userId = req.params.userID;
    try {
        const user = await User.findById(userId);
        const userPrefs = user.preferences;

        const household = await Household.findById(householdId);
        const householdAlerts = household.alerts;

        // Filter alerts through user preferences
        let userAlerts = [];
        for (const alert of householdAlerts.reverse()) {
            // Check user's preference for this type of notification
            let preference = "all";
            if (alert.category == "Payment" && userPrefs.get("paymentNotif")) {
                preference = userPrefs.get("paymentNotif");
            } else if (alert.category == "Expiration" && userPrefs.get("expirationNotif")) {
                preference = userPrefs.get("expirationNotif");
            } else if (alert.category == "Nudge") {
                // Nudge: only add if user is on recipient list
                preference = "relevant";
            }

            // Display alert based on preference
            if (preference == "all") {
                // Add alert
                userAlerts.push(alert);
            } else if (preference == "relevant") {
                // Add alert only if user is on recipient list
                for (const recipient of alert.recipients) {
                    if (recipient == userId) {
                        console.log("relevant added")
                        // Add to list
                        userAlerts.push(alert);
                        break;
                    }
                }
            }
        }
        
        res.status(200).send(userAlerts);
    } catch (err) {
        console.log(err)
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