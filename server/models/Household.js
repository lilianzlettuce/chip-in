import mongoose, { mongo } from "mongoose";

const debtSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }
}, { _id: false });

const alertSchema = new mongoose.Schema({
    //_id: { type: mongoose.Schema.Types.ObjectId, required: true},
    category: {
        type: String,
        enum: ['Payment', 'Nudge', 'Expiration'],
        required: true
    },
    content: { type: String, required: true },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    date: { type: Date, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
});

const noteSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Note', 'Reminder', 'Meeting', 'TODO'],
        required: true
    },
    content: { type: String, required: true },
    urgent: { type: Boolean, required: false, default: false }
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    directions: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const utilitySchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Water', 'Electricity', 'Internet'],
        required: true
    },
    amount: { type: Number, required: true },
    paid: { type: Boolean, required: true, default: false },
    view: { type: Boolean, required: true, default: true },
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const householdSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    groceryList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
    purchasedList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
    debts: [debtSchema],
    alerts: [alertSchema],
    notes: [noteSchema],
    recipes: [recipeSchema],
    utilities: [utilitySchema],
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false }],
});

householdSchema.pre('save', function (next) {
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

    const utilityCategories = ['Water', 'Electricity', 'Internet'];
    household.members.forEach((member) => {
        utilityCategories.forEach((category) => {
            const exists = household.utilities.some(
                (utility) =>
                    utility.owedBy.toString() === member.toString() &&
                    utility.category === category
            );
            if (!exists) {
                household.utilities.push({
                    category: category,
                    amount: 0,
                    paid: false,
                    view: true,
                    owedBy: member,
                });
            }
        });
    });

    next();
});

const Household = mongoose.model("Household", householdSchema)

export default Household;