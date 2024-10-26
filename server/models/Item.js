import mongoose, { mongo }  from "mongoose";

const splitSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    split: { type: Number, required: true }
}, { _id: false });

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { 
        type: String,
        enum: ['Food', 'Cleaning', 'Drink', 'Toiletries', 'Pet'],
        required: true },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sharedBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    splits: [splitSchema],
    purchaseDate: { type: Date, required: false},
    expirationDate: { type: Date, required: false},
    cost: {type: Number, required: false},
    archived: {type: Boolean, default: false}
});

const Item = mongoose.model("Item", itemSchema)

export default Item;