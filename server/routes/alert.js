import express from 'express';
import Household from '../models/Household.js';
import User from '../models/User.js'

import { ObjectId } from 'mongodb';

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

// Route to mark all household alerts as read for this user
router.patch('/markAsRead/:householdID/:userID', async (req, res) => {
    const householdId = req.params.householdID;
    const userId = req.params.userID;
    const { alertUpdates } = req.body;
  
    try {
      // Perform updates for each alert in the input array
      for (const alert of alertUpdates) {
        const { _id } = alert;
  
        const result = await Household.updateOne(
            { _id: householdId }, // Find household by id
            {
              $addToSet: { 'alerts.$[alert].readBy': new ObjectId(userId) }
            },
            {
              arrayFilters: [
                { 'alert._id': new ObjectId(_id) } // Match by alert ID
              ]
            },
        );
      }
  
      res.status(200).json({msg: "household alerts updated"});
    } catch (error) {
      console.error('Error updating alerts:', error);
      res.status(500).json({msg: error});
    }
});

// Route to mark all household alerts as unread for this user
// (removes userId from the readBy field of all alerts)
router.patch('/markAsUnread/:householdID/:userID', async (req, res) => {
  const householdId = req.params.householdID;
  const userId = new ObjectId(req.params.userID);

  try {
    const result = await Household.updateOne(
      { _id: householdId }, // Find household by ID
      {
        $pull: { 'alerts.$[].readBy': userId } // Remove userId from readBy of all alerts
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'No matching household found' });
    }

    res.status(200).json({ msg: 'User removed from readBy in all alerts' });
  } catch (error) {
    console.error('Error updating alerts:', error);
    res.status(500).json({ msg: error.message });
  }
});

// send nudge alert
router.post('/nudge', async (req, res) => {
    let {householdId, nudgerId, recipientId, message, amount} = req.body;
    const currentDate = new Date();

    try {
        const nudger = await User.findById(nudgerId);
        if (!nudger) {
            return res.status(404).send({ error: `Nudger not found`})
        }
        if ((!message || message === '') && (!amount || amount ==='')) {
            message = `Friendly reminder from ${nudger.username} to pay them back!` 
        } else if (!amount || amount ==='') {
            message = `Friendly reminder from ${nudger.username}: ${message}`;
        } else if (!message || message === '') {
            message = `Friendly reminder from ${nudger.username} to pay them back \$${amount}!` 
        } else {
            message = `Friendly reminder from ${nudger.username} to pay them back \$${amount}! Also, ${message}` 
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

        res.status(201).send(newAlert)
    } catch (err) {
        console.error('Error:', err); 
        res.status(500).send({err})
    } 
});
export default router;