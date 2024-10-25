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

    let payload = {
        "name": "spinach",
        "category": "Food",
        "purchasedBy": user1Id,
        "sharedBetween": [user2Id, user3Id],
        "purchaseDate": "2024-10-12T10:00:00.000+00:00",
        "expirationDate": "2024-11-28T10:00:00.000+00:00",
        "cost": "499",
        "householdId": householdId
    }
    let response = await api
        .post(`/item/addtopurchased/`)
        .send(payload)
        .expect(201)

    payload = {
        "name": "dawn",
        "category": "Cleaning",
        "purchasedBy": user1Id,
        "sharedBetween": [user1Id, user3Id],
        "purchaseDate": "2024-10-12T10:00:00.000+00:00",
        "expirationDate": "2024-11-28T10:00:00.000+00:00",
        "cost": "499",
        "householdId": householdId
    }
    response = await api
        .post(`/item/addtopurchased/`)
        .send(payload)
        .expect(201)
    
    payload = {
        "name": "litter",
        "category": "Pet",
        "purchasedBy": user2Id,
        "sharedBetween": [user2Id, user3Id],
        "purchaseDate": "2024-10-12T10:00:00.000+00:00",
        "expirationDate": "2024-11-28T10:00:00.000+00:00",
        "cost": "499",
        "householdId": householdId
    }
    response = await api
        .post(`/item/addtopurchased/`)
        .send(payload)
        .expect(201)

    payload = {
        "name": "tuna",
        "category": "Food",
        "purchasedBy": user2Id,
        "sharedBetween": [user1Id, user2Id, user3Id],
        "purchaseDate": "2024-10-12T10:00:00.000+00:00",
        "expirationDate": "2024-11-28T10:00:00.000+00:00",
        "cost": "499",
        "householdId": householdId
    }
    response = await api
        .post(`/item/addtopurchased/`)
        .send(payload)
        .expect(201)
})

describe('filtering items', () => {
    test('user1 items', async () => {
        let users = [user1Id]
        let response = await api
            .get(`/filter/filterby/${householdId}`)
            .query(
                {sharedBetween: ['john']}
            )
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert(Array.isArray(response.body));
        response.body.forEach(item => {
            const containsAllUsers = users.every(user => item.sharedBetween.includes(user));
            assert(containsAllUsers, `item's should be shared with user1`)
        });
    })

    test('user2, user3 items', async () => {
        let users = [user2Id, user3Id]
        let response = await api
            .get(`/filter/filterby/${householdId}`)
            .query(
                {sharedBetween: 'david,mary'}
            )
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert(Array.isArray(response.body));
        response.body.forEach(item => {
            const containsAllUsers = users.every(user => item.sharedBetween.includes(user));
            assert(containsAllUsers, `item's should be shared with user1`)
        });
    })

    test('food items', async () => {
        let users = [user2Id, user3Id]
        let response = await api
            .get(`/filter/filterby/${householdId}`)
            .query(
                {category: 'Food'}
            )
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert(Array.isArray(response.body));
        response.body.forEach(item => {
            assert.strictEqual(item.category, `Food`)
        });
    })

    test('food items shared with user3', async () => {
        let users = [user3Id]
        let response = await api
            .get(`/filter/filterby/${householdId}`)
            .query(
                {
                    sharedBetween: 'david,mary',
                    category: 'Food'
                }
            )
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert(Array.isArray(response.body));
        response.body.forEach(item => {
            const containsAllUsers = users.every(user => item.sharedBetween.includes(user));
            assert(item.category, 'Food')
            assert(containsAllUsers, `item's should be shared with user1`)
        });
    })
})

describe('sorting items', () => {
    test('sort items by expirationDate', async () => {
        let response = await api
            .get(`/filter/sortby/${householdId}`)
            .query(
                {sortby: 'expirationDate'}
            )
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert(Array.isArray(response.body));
        for (let i = 0; i < response.body.length - 1; i++) {
            const curr = new Date(response.body[i].expirationDate);
            const next = new Date(response.body[i + 1].expirationDate);
            assert(curr <= next, `Items are not sorted by expiration date at index ${i}`);
        }
    })
})

after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

