import { test, before, after, beforeEach, afterEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from "../server.js";
import User from "../models/User.js"
import Household from "../models/Household.js"
import Item from "../models/Item.js"
import cron from 'node-cron'

const api = supertest(app);

let user1Id;
let user2Id;
let user3Id;
let householdId;

before(async () => {
    await User.deleteMany({});
    await Household.deleteMany({})
    await Item.deleteMany({})

    const user1 = new User({
        "email": "test111@gmail.com",
        "username": "john",
        "password": "12345"
    })
    await user1.save();
    user1Id = user1._id;
    const user2 = new User({
        "email": "test112@gmail.com",
        "username": "david",
        "password": "12345"
    })
    await user2.save();
    user2Id = user2._id;

    const user3 = new User({
        "email": "test113@gmail.com",
        "username": "mary",
        "password": "12345"
    })
    await user3.save();
    user3Id = user3._id;

    const household = new Household({
        "name" : "earhart147",
        "members": [user1Id, user2Id]
    })
    await household.save()
    householdId = household._id;

    // console.log(householdId, user1Id, user2Id, user3Id)
})

describe('adding notes', () => {
    test('add urgent to-do', async () => {
        const payload = {
            "content": "pay electric bill",
            "category": "TODO",
            "urgent": true
        }
        let response = await api
            .post(`/note/${householdId}`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const household = await Household.findById(householdId);
        assert.strictEqual(household.notes.length, 1);
        assert.strictEqual(household.notes[0].urgent, true);
        assert.strictEqual(household.notes[0].category, 'TODO');
    })

    test('invalid category', async () => {
        const payload = {
            "content": "fix toilet",
            "category": "askdlfkwelaf",
            "urgent": true
        }
        let response = await api
            .post(`/note/${householdId}`)
            .send(payload)
            .expect(500)
            .expect('Content-Type', /application\/json/)
        
        const household = await Household.findById(householdId);
        assert.strictEqual(household.notes.length, 1);
    })

    test('add meeting', async () => {
        const payload = {
            "content": "7:00pm Thursday",
            "category": "Meeting",
            "urgent": false
        }
        let response = await api
            .post(`/note/${householdId}`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const household = await Household.findById(householdId);
        assert.strictEqual(household.notes.length, 2);
        assert.strictEqual(household.notes[1].category, 'Meeting');
    })
})

describe('deleting notes', () => {
    test('delete note by id', async () => {
        let household = await Household.findById(householdId);
        assert.strictEqual(household.notes.length, 2);
        
        let response = await api
            .delete(`/note/${householdId}/${household.notes[0]._id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        household = await Household.findById(householdId)
        assert.strictEqual(household.notes.length, 1);
    })
})

after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

