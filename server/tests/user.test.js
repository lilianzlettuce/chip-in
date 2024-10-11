import { test, before, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from "../server.js";
import User from "../models/User.js"
import { response } from 'express';

const api = supertest(app);

before(async () => {
    await User.deleteMany({});
})

describe('signup/login', () => {
    test('signup account', async () => {
        const newUser = {
            "email": "test112@gmail.com",
            "username": "ivy",
            "password": "12345"
        }
        await api
            .post('/auth/signup')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
    
    test('login with incorrect password', async () => {
        const user = {
            "username": "ivy",
            "password": "akslfjskafjdkfw"
        }
        const response = await api
            .post('/auth/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, "Invalid Password")
    })

    test('login with correct password', async () => {
        const user = {
            "username": "ivy",
            "password": "12345"
        }
        const response = await api
            .post('/auth/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.message, "Success")
    })
})


after(async () => {
    await mongoose.connection.close()
})