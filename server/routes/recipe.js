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

// save ingredients to flask app
router.post('/generate-recipe', async (req, res) => {
    const { items } = req.body;
    try {
        const response = await fetch(`http://localhost:${process.env.FLASK_PORT}/generate-recipe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate recipe');
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all recipes from a household
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

// save recipe in a household
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

// delete a recipe from a household
router.delete('/:householdId/:recipeId', async (req, res) => {
    const { householdId, recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(householdId) || !mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const recipeIndex = household.recipes.findIndex(recipe => recipe._id.toString() === recipeId);
        if (recipeIndex === -1) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        household.recipes.splice(recipeIndex, 1);
        await household.save();

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// search for recipes by search term
router.get('/search/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { searchTerm } = req.query;

    if (!mongoose.Types.ObjectId.isValid(householdId)) {
        return res.status(400).json({ error: 'Invalid household ID format' });
    }

    try {
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const matchingRecipes = household.recipes.filter(recipe => {
            return (
                (typeof recipe.title === 'string' && recipe.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (typeof recipe.ingredients === 'string' && recipe.ingredients.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (typeof recipe.directions === 'string' && recipe.directions.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (Array.isArray(recipe.tags) && recipe.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowerCaseSearchTerm)))
            );
        });

        res.status(200).json(matchingRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;