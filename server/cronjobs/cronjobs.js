import cron from 'node-cron';
import Item from '../models/Item.js'
import Household from '../models/Household.js';
import User from '../models/User.js'

const createAlerts = async () => {
    try {
        //get all households
        const households = await Household.find().populate('purchasedList');
        console.log(households.length)

        // const today = new Date();
        // const threshold = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 5));
        // today.setUTCHours(0, 0, 0, 0);

        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const threshold = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 5));
        
        console.log('now', now)
        console.log('threshold', threshold)
        console.log('today', today)


        for (const household of households) {
            console.log(household.name)
            const alerts = [];

            household.purchasedList.forEach((item) => {
                const expirationDate = new Date(item.expirationDate);
                const expirationDateUTC = new Date(Date.UTC(
                    expirationDate.getUTCFullYear(),
                    expirationDate.getUTCMonth(),
                    expirationDate.getUTCDate()
                ));
                console.log(item.name, expirationDateUTC)

                if (expirationDateUTC.getTime() === threshold.getTime()) {
                    const message = `${item.name} is close to expiring, use it soon!`;
                    const newAlert = {
                        category: 'Expiration',
                        content: message,
                        recipients: item.sharedBetween,
                        date: today
                    }
                    alerts.push(newAlert);
                }

                if (expirationDateUTC.getTime() === today.getTime()) {
                    const message = `${item.name} expires today, use it today or throw it out!`;
                    const newAlert = {
                        category: 'Expiration',
                        content: message,
                        recipients: item.sharedBetween,
                        date: today
                    }
                    alerts.push(newAlert);
                }
            })
            if (alerts.length > 0) {
                await Household.findByIdAndUpdate(
                    household._id,
                    { $push: { alerts: { $each: alerts } } },
                    { new: true }
                );
            }
        }
        console.log('Done checking for expiration!')
    } catch (err) {
        console.log('error creating alerts:', err);
    }
} 

cron.schedule('39 22 * * *', () => {
    console.log('Running expiration check...');
    createAlerts();
});