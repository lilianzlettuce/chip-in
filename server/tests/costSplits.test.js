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

describe('updating debts', () => {
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

    test('adding item', async () => {
        let payload = {
            "name": "spinach",
            "category": "Pet",
            "purchasedBy": user1Id,
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
        
        const household = await Household.findById(householdId);
        itemId = household.purchasedList[0];

        const debt = household.debts.find(
           (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 250);
    })

    test('adding item, decimal price', async () => {
        let payload = {
            "name": "beef",
            "category": "Food",
            "purchasedBy": user1Id,
            "sharedBetween": [user1Id, user3Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "4.99",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)
        
        const household = await Household.findById(householdId);

        const debt = household.debts.find(
           (d) => d.owedBy.toString() === user3Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 249.5);
    })

    test('adding item, purchasedBy does not share item', async () => {
        let payload = {
            "name": "oreos",
            "category": "Food",
            "purchasedBy": user1Id,
            "sharedBetween": [user2Id, user3Id],
            "purchaseDate": "2024-10-12T10:00:00.000+00:00",
            "expirationDate": "2024-11-28T10:00:00.000+00:00",
            "cost": "5",
            "householdId": householdId
        }
        let response = await api
            .post(`/item/addtopurchased/`)
            .send(payload)
            .expect(201)
        
        const household = await Household.findById(householdId);
        let debt = household.debts.find(
            (d) => d.owedBy.toString() === user3Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 499.5);
        debt = household.debts.find(
            (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 500);
        debt = household.debts.find(
            (d) => d.owedBy.toString() === user1Id.toString() && d.owedTo.toString() === user2Id.toString()
        );
        assert.strictEqual(debt.amount, 0);
        debt = household.debts.find(
            (d) => d.owedBy.toString() === user1Id.toString() && d.owedTo.toString() === user3Id.toString()
        );
        assert.strictEqual(debt.amount, 0);
    })
})

describe('editing items', () => {
    test('editing name/category', async () => {
        let payload = {
            "name": "prewashed spinach",
            "category": "Food",
            "cost": 500,
            "householdId": householdId
        }
        let response = await api
            .patch(`/item/editpurchased/${itemId}/`)
            .send(payload)
            .expect(200)
        
        const spinach = await Item.findById(itemId);
        assert.strictEqual(spinach.name, "prewashed spinach");
        assert.strictEqual(spinach.category, "Food");
    })

    test('editing cost', async () => {
        let payload = {
            "name": "prewashed spinach",
            "category": "Food",
            "cost": 1000,
            "householdId": householdId
        }
        let response = await api
            .patch(`/item/editpurchased/${itemId}/`)
            .send(payload)
            .expect(200)
        
        const spinach = await Item.findById(itemId);
        assert.strictEqual(spinach.name, "prewashed spinach");
        assert.strictEqual(spinach.category, "Food");

        const household = await Household.findById(householdId);
        const debt = household.debts.find(
            (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
         );
         assert.strictEqual(debt.amount, 750);
    })

})


describe('payments', () => {
    test('pay in full', async () => {
        let payload = {
            "owedById": user3Id,
            "owedToId": user1Id
        }
        let response = await api
            .patch(`/payment/payall/${householdId}`)
            .send(payload)
            .expect(200)
        
        const household = await Household.findById(householdId);
        let debt = household.debts.find(
            (d) => d.owedBy.toString() === user3Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 0);
        debt = household.debts.find(
            (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 750);
    })

    test('pay partial debt', async () => {
        let payload = {
            "owedById": user2Id,
            "owedToId": user1Id,
            "amount": 250
        }
        let response = await api
            .patch(`/payment/partialpay/${householdId}`)
            .send(payload)
            .expect(200)
        
        const household = await Household.findById(householdId);
        let debt = household.debts.find(
            (d) => d.owedBy.toString() === user2Id.toString() && d.owedTo.toString() === user1Id.toString()
        );
        assert.strictEqual(debt.amount, 500);
    })
})

after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

