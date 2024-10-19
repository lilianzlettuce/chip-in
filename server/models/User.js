import mongoose, { mongo }  from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    households: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: false }],
    preferences: {
        type: Map,
        of: {type: String, enum: ['all', 'relevant', 'none']},
        required: false,
        default: {
            expirationNotif: 'all',
            paymentNotif: 'all',
        }
    },
    pfp: {type: String, required: false},
    bio: {type: String, reqired: false}
});

const User = mongoose.model("User", userSchema)

export default User;