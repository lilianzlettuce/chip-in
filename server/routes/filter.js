import express from 'express';
import Item from '../models/Item.js';
import Household from '../models/Household.js';
import User from '../models/User.js'

const router = express.Router();

router.get('/sortby/:id', async (req, res) => {
    const id = req.params.id;
    const { sortby } = req.query;
    try {
        const household = await Household.findById(id).populate('purchasedList');

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        
        if (sortby === "expirationDate") {
            household.purchasedList.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
        } else {
            household.purchasedList.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
        }

        res.status(200).json(household.purchasedList);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

// filter items
router.get('/filterby/:id', async (req, res) => {
    const id = req.params.id;
    const { category, purchasedBy, minPrice, maxPrice, sharedBetween } = req.query;
  
    try {
        const household = await Household.findById(id).populate({
            path: 'purchasedList',
            populate: [
                {
                    path: 'purchasedBy',  
                    select: 'username'    
                },
                {
                    path: 'sharedBetween',
                    select: '_id username' // Make sure to select the _id here for comparison
                }
            ]
        });
  
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
  
        let filteredItems = household.purchasedList;
    
        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            filteredItems = filteredItems.filter(item => categories.includes(item.category));
        }
    
        if (purchasedBy) {
            filteredItems = filteredItems.filter(item => item.purchasedBy.username === purchasedBy);
        }
    
        if (minPrice) {
            filteredItems = filteredItems.filter(item => (item.cost / 100) >= parseFloat(minPrice));
        }
    
        if (maxPrice) {
            filteredItems = filteredItems.filter(item => (item.cost / 100) <= parseFloat(maxPrice));
        }

        // Update: Now split the sharedBetween IDs and filter by matching IDs
        if (sharedBetween) {
            const selectedIds = sharedBetween.split(',');
            filteredItems = filteredItems.filter(item => {
                const sharedIds = item.sharedBetween.map(user => user._id.toString());
                return selectedIds.every(id => sharedIds.includes(id));
            });
        }
  
        res.status(200).json(filteredItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router