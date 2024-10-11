import { test, before, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from "../server.js";
import User from "../models/User.js"
import Household from "../models/Household.js"
import Item from "../models/Item.js"


import { response } from 'express';

const api = supertest(app);

let user1Id;
let user2Id;
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
})

describe('creating household', () => {
    test('create basic household', async () => {
        const household = {
            "name" : "earhart147",
            "members": [user1Id]
        }
        const response = await api
            .post('/household')
            .send(household)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        householdId = response.body._id;
        assert.strictEqual(response.body.members.length, 1);
    })

    test('add user to household', async () => {
        const response = await api
            .post(`/household/addUser/${householdId}`)
            .send({userId: user2Id})
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.members.length, 2);
        assert.strictEqual(response.body.debts.length, 2)

    })

})

describe('items in lists', () => {
    test('add item to grocery list', async () => {
        const payload = {
            "name": "chicken",
            "category": "food",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtogrocery/`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const household = await Household.findById(householdId)
        assert.strictEqual(household.groceryList.length, 1);
        response = await api
            .get(`/household/${householdId}/grocerylist`)
        assert.strictEqual(response.body[0].name, 'chicken');
    })

    test('add item to purchased list', async () => {
        const payload = {
            "name": "spinach",
            "category": "food",
            "purchasedBy": user1Id,
            "sharedBetween": [user1Id, user2Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "499",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const household = await Household.findById(householdId)
        assert.strictEqual(household.purchasedList.length, 1);
        response = await api
            .get(`/household/${householdId}/purchasedList`)
        assert.strictEqual(response.body[0].name, 'spinach');
    })

    test('add item to purchased list with missing fields', async () => {
        const payload = {
            "name": "spinach",
            "category": "food",
            "sharedBetween": [user1Id, user2Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "499",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        
        assert.strictEqual(response.body.message, "Fields must be populated");
    })
})

after(async () => {
    await mongoose.connection.close()
})