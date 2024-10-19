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
        
        res.status(200).send(households.alerts);
    } catch (err) {
        res.status(500).send({err})
    }
});


export default router;