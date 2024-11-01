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
            "category": "Food",
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
            "category": "Food",
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
            "category": "Food",
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

    test('move item from grocery to purchased list', async () => {
        const chicken = await Item.findOne({name: "chicken"});
        const payload = {
            "sharedBetween": [user1Id, user2Id],
            "purchasedBy": user1Id,
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "1299",
            "householdId": householdId,
            "itemId": chicken._id
        }
        let response = await api
            .patch(`/household/purchase`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const household = await Household.findById(householdId)
        assert.strictEqual(household.purchasedList.length, 2);
        assert.strictEqual(household.groceryList.length, 0);

    })

    test('move item from purchased to grocery list', async () => {
        const chicken = await Item.findOne({name: "chicken"});
        const payload = {
            "householdId": householdId,
            "itemId": chicken._id
        }
        let response = await api
            .patch(`/household/repurchase`)
            .send(payload)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const household = await Household.findById(householdId)
        assert.strictEqual(household.purchasedList.length, 2);
        assert.strictEqual(household.groceryList.length, 1);

    })
})

describe('leaving household', () => {
    test('user 1 leaving', async () => {
        const payload = {
            "userId" : user1Id
        }
        const response = await api
            .post(`/household/leave/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.message, 'User successfully removed from household')
        const household = await Household.findById(householdId)
        assert.strictEqual(household.members.length, 1)
    })

    test('last user leaving', async () => {
        const payload = {
            "userId" : user2Id
        }
        try {
            let response = await api
                .post(`/household/leave/${householdId}`)
                .send(payload)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            assert.strictEqual(response.body.message, 'Household deleted as the last member left')
            response = await api
                .get(`/household/${householdId}`)
                .expect(404)
        } catch (err) {
            console.log(err)
        }
        
    })
})

after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})