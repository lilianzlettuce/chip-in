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
let itemId;

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

describe('balancing debts', () => {
    test('check initial debt creation', async () => {
        const household = await Household.findById(householdId);
        assert.strictEqual(household.debts.length, 2);
    })

    test('debt creation when adding user', async () => {
        let household = await Household.findById(householdId);
        assert.strictEqual(household.debts.length, 2);

        const payload = {
            "userId": user3Id
        }
        let response = await api
            .post(`/household/addUser/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        household = await Household.findById(householdId);
        assert.strictEqual(household.debts.length, 6);
    })

    test('user1 buys item shared with user2', async () => {
        let payload = {
            "name": "spinach",
            "category": "Pet",
            "purchasedBy": user1Id,
            "sharedBetween": [user1Id, user2Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "20",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)
        
        let household = await Household.findById(householdId);
        itemId = household.purchasedList[0];

        let debt = household.debts.find(
           (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
        );

        assert.strictEqual(debt.amount, 1000);

    })

    test('user2 buys item shared with user1', async () => {
        let payload = {
            "name": "chips",
            "category": "Food",
            "purchasedBy": user2Id,
            "sharedBetween": [user1Id, user2Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "5",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)
        
        
        response = await api
            .patch(`/payment/debts/${householdId}`)
            .expect(200)
        
        let balancedDebts = response.body;
        let debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user1Id.toString() && d.owedTo._id.toString() === user2Id.toString()
        );
        assert.strictEqual(debt.amount, 0);
        debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user2Id.toString() && d.owedTo._id.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 750);

    })

    test('user2 buys item expensive enought to cancel out debt', async () => {
        let payload = {
            "name": "beef",
            "category": "Food",
            "purchasedBy": user2Id,
            "sharedBetween": [user1Id, user2Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "30",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)

        itemId = response.body._id;
        console.log('item id', itemId);
        response = await api
            .patch(`/payment/debts/${householdId}`)
            .expect(200)
        
        let balancedDebts = response.body;
        let debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user1Id.toString() && d.owedTo._id.toString() === user2Id.toString()
        );
        assert.strictEqual(debt.amount, 750);
        debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user2Id.toString() && d.owedTo._id.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 0);

    })
})

describe('returning items', () => {
    test('user2 returns item', async () => {
        let payload = {
            "itemId": itemId,
        }
        let response = await api
            .patch(`/payment/return/${householdId}`)
            .send(payload)
            .expect(200)
        
        response = await api
            .patch(`/payment/debts/${householdId}`)
            .expect(200)
        console.log(response.body)
        let balancedDebts = response.body;
        let debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user1Id.toString() && d.owedTo._id.toString() === user2Id.toString()
        );
        assert.strictEqual(debt.amount, 0);
        debt = balancedDebts.find(
            (d) => d.owedBy._id.toString() === user2Id.toString() && d.owedTo._id.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 750);

    })
})


after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

