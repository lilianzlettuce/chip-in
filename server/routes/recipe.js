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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ items })
        })
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;