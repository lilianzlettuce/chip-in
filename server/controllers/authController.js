import axios from 'axios';
import jwt from 'jsonwebtoken';
import oauth2Client from '../utils/oauth2client.js';
import catchAsync from './../utils/catchAsync.js';

import User from '../models/User.js';

/*const axios = require('axios');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const oauth2Client = require('../utils/oauth2client');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');*/

const signToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        households: user.households,
        preferences: user.preferences,
    }
    console.log("payload: ", payload)

    return jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_TIMEOUT},
    );
};

// Create and send Cookie ->
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user);
    console.log("token: ", token)

    console.log(process.env.JWT_TIMEOUT);
    const cookieOptions = {
        expires: new Date(Date.now() + +process.env.JWT_TIMEOUT),
        httpOnly: true,
        path: '/',
        // sameSite: "none",
        secure: false,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }

    user.password = undefined;

    res.cookie('jwt', token, cookieOptions);

    console.log(user);

    return res.status(statusCode).json({
        message: "Success",
        token: token, //"Bearer " + token,
        id: user._id,
    });
};

/* GET Google Authentication API. */
const googleAuth = catchAsync(async (req, res, next) => {
    const code = req.query.code;
    console.log("USER CREDENTIAL -> ", code);

    const googleRes = await oauth2Client.getToken(code);
    
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
	);
	
    let user = await User.findOne({ email: userRes.data.email });
   
    if (!user) {
        console.log('New User found');
        console.log(userRes);

        user = await User.create({
            username: userRes.data.name,
            email: userRes.data.email,
            password: "Pass54321",
            pfp: userRes.data.picture,
        });
    }

    createSendToken(user, 201, res);
});

export default googleAuth;