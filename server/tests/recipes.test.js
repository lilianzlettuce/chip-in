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

let user1Id, user2Id, user3Id, householdId, recipeId;

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
        "members": [user1Id, user2Id, user3Id]
    })
    await household.save()
    householdId = household._id;
})

describe('recipe tests', () => {
    test('generate a recipe', async () => {
        const payload = {
            "items": "eggs, tomatoes, beans, rice",
        }
        let response = await api
            .post(`/recipes/generate-recipe`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.ok(response.body.title != null);
        assert.ok(response.body.ingredients != null);
        assert.ok(response.body.directions != null);
    })

    test('saving a recipe', async () => {
        const payload = {
            "householdId": householdId,
            "title": "cookies",
            "ingredients": "- sugar\n- flour\n- salt",
            "directions": "1. mix\n2.bake",
            "owner": user1Id
        }
        let response = await api
            .post(`/recipes/save-recipe`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        let household = await Household.findById(householdId);
        assert.strictEqual(household.recipes.length, 1);
    })

    test('deleting a recipe', async () => {
        let household = await Household.findById(householdId);
        recipeId = household.recipes[0]._id;
        let response = await api
            .delete(`/recipes/${householdId}/${recipeId}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        household = await Household.findById(householdId);
        assert.strictEqual(household.recipes.length, 0);
    })

})


after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

