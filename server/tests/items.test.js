import { test, before, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from "../server.js";
import User from "../models/User.js"
import Household from "../models/Household.js"

import { response } from 'express';

const api = supertest(app);

let user1Id;
let user2Id;
let householdId;

before(async () => {
    await User.deleteMany({});
    await Household.deleteMany({})
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

    })
})


after(async () => {
    await mongoose.connection.close()
})