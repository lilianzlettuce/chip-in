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

describe('utilities in database', () => {
    test('check initial utilities creation', async () => {
        const household = await Household.findById(householdId);
        assert.strictEqual(household.utilities.length, 6);
    })

    test('update household utilites when adding user', async () => {
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
        assert.strictEqual(household.utilities.length, 9);
    })
})

describe('updating bills as user', () => {
    test('setting electricity bill for household', async () => {
        const payload = {
            "category": "Water",
            "amount": 40
        }
        let response = await api
            .patch(`/utilities/update-amount/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let users = [user1Id, user2Id, user3Id]
        let household = await Household.findById(householdId);
        // console.log(household.utilities)
        
        users.forEach((user) => {
            let util =  household.utilities.find(
                (utility) => utility.owedBy.toString() === user.toString() && utility.category === 'Water'
            );
            // console.log(user)
            assert.strictEqual(util.amount, 40);
        })     
    })

    test('paying electricity bill', async () => {
        const payload = {
            "category": "Water",
            "userId": user1Id
        }
        let response = await api
            .patch(`/utilities/pay/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        response = await api
            .get(`/utilities/${householdId}/${user1Id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        let util =  response.body.find(
            (utility) => utility.category === 'Water'
        );
        // console.log(user1Id)
        // console.log(util)
        assert.strictEqual(util.paid, true);
    })

    test('hiding electric bill', async () => {
        const payload = {
            "category": "Electricity",
            "userId": user1Id
        }
        let response = await api
            .patch(`/utilities/hide/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        response = await api
            .get(`/utilities/${householdId}/${user1Id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        let util =  response.body.find(
            (utility) => utility.category === 'Electricity'
        );
        assert.strictEqual(util.view, false);
    })

    test('resetting household bills', async () => {
        const payload = {
            "category": "Water",
        }
        let response = await api
            .patch(`/utilities/reset/${householdId}`)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let users = [user1Id, user2Id, user3Id]
        let household = await Household.findById(householdId);
        // console.log(household.utilities)
        
        users.forEach((user) => {
            let util =  household.utilities.find(
                (utility) => utility.owedBy.toString() === user.toString() && utility.category === 'Water'
            );
            // console.log(user)
            assert.strictEqual(util.paid, false);
        })
    })
})


after(async () => {    
    await mongoose.connection.close()
    console.log('mongoose connection closed')
    cron.getTasks().forEach(task => task.stop());
    console.log('All cron jobs stopped');
})

