import express from 'express';
import mongoose from 'mongoose';
import Household from '../models/Household.js';

const router = express.Router();

// get recipe from flask app
router.get('/generate-recipe', async (req, res) => {
    const { items } = req.body;
    try {
        const response = await fetch(`http://localhost:${process.env.FLASK_PORT}/generate-recipe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        })
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get all recipes from a household
router.get('/:householdId', async (req, res) => {
    const { householdId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(householdId)) {
        return res.status(400).json({ error: 'Invalid household ID format' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }
        res.status(200).json(household.recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//save recipe in a household
router.post('/save-recipe', async (req, res) => {
    const { householdId, title, ingredients, directions, owner } = req.body;

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const newRecipe = {
            title,
            ingredients,
            directions,
            owner
        };

        household.recipes.push(newRecipe);

        await household.save();

        res.status(201).json({ message: 'Recipe saved successfully', recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;