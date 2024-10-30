import express from 'express';
import mongoose from 'mongoose';
import Household from '../models/Household.js';

const router = express.Router();


// get all notes
router.get('/:householdId', async (req, res) => {
    try {
        const household = await Household.findById(req.params.householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        res.status(200).json(household.notes);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// add a new note to a household
router.post('/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const { category, content, urgent = false } = req.body;

    try {
        const household = await Household.findById(householdId);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        const newNote = { category, content, urgent };
        household.notes.push(newNote);
        await household.save();
        const addedNote = household.notes[household.notes.length - 1];
        res.status(201).json({ message: 'Note added successfully', note: addedNote });
    } catch (error) {
        // console.error('Error adding note:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// update a note in a household
router.put('/:householdId/:noteId', async (req, res) => {
    const { householdId, noteId } = req.params;
    const { category, content, urgent } = req.body;

    try {
        const household = await Household.findById(householdId);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        const note = household.notes.id(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (category !== undefined) note.category = category;
        if (content !== undefined) note.content = content;
        if (urgent !== undefined) note.urgent = urgent;

        await household.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// delete a note from a household
router.delete('/:householdId/:noteId', async (req, res) => {
    const { householdId, noteId } = req.params;

    try {
        const household = await Household.findById(householdId);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        const noteToRemove = household.notes.id(noteId);
        if (!noteToRemove) {
            return res.status(404).json({ message: 'Note not found' });
        }

        household.notes.pull(noteId);
        await household.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;