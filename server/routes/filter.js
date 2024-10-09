import express from 'express';
import Item from '../models/Item.js';
import Household from '../models/Household.js';
import User from '../models/User.js'

const router = express.Router();

router.get('/sortby/:id', async (req, res) => {
    const id = req.params.id;
    const { field } = req.query.field;

    try {
        const household = await Household.findById(id).populate('purchasedList');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    if (field == "expirationDate") {
        household.purchasedList.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    } else {
        household.purchasedList.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
    }

    res.status(200).json(household.purchasedList);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});




export default router