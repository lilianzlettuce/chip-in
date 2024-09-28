import mongoose, { mongo }  from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { type: String, required: true },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sharedBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    purchaseDate: { type: Date, required: false},
    expirationDate: { type: Date, required: false},
    cost: {type: Number, required: false},
    archived: {type: Boolean, default: false}
});

const Item = mongoose.model("Item", itemSchema)

export default Item;