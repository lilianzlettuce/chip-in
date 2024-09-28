import mongoose, { mongo }  from "mongoose";

const debtSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    owedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: { type: Number, required: true}
});

const alertSchema = new mongoose.Schema({
    category: { type: String, required: true},
    content: { type: String, required: true}
});


const householdSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    groceryList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
    purchasedList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
    debts: [debtSchema],
    alerts: [alertSchema],
    notes: { type: [String], required: false},
    recipes: { type: [String], required: false},
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
});

const Household = mongoose.model("Household", householdSchema)

export default Household;