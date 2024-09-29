import mongoose, { mongo }  from "mongoose";

const debtSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    owedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: { type: Number, required: true}
}, { _id: false });

const alertSchema = new mongoose.Schema({
    category: { type: String, required: true},
    content: { type: String, required: true}
}, { _id: false });


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

householdSchema.pre('save', function(next) {
    const household = this;
    household.debts = [];

    for (let i = 0; i < household.members.length; i++) {
        for (let j = 0; j < household.members.length; j++) {
            if (i != j) {
                household.debts.push({
                    owedBy: household.members[i],
                    owedTo: household.members[j],
                    amount: 0
                })
            }
        }
    }

    next();
});

const Household = mongoose.model("Household", householdSchema)

export default Household;