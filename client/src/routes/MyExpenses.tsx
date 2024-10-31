import { useParams } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { useEffect, useState } from 'react';

import PayStat from '../components/PayStat';
import ExpenseCard from '../components/ExpenseCard';
import Alerts from '../components/Alerts';

import './MyExpenses.css'

export default function MyExpenses() {
    const { householdId } = useParams();
    const { user } = useUserContext();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    // const expenses = [
    //     { id: '1', owedTo: 90, owedFrom: 5 },
    //     { id: '2', owedTo: 120, owedFrom: 30 },
    // ];
    // const [debts, setDebts] = useState([]);

    interface User {
        _id: string;
        username: string;
    }

    interface Debt {
        owedBy: User;
        owedTo: User;
        amount: number;
    }

    interface Expense {
        roommateId: string;
        roommateName: string;
        owesYou: number;
        youOwe: number;
    }

    useEffect(() => {
        if (householdId) {
            fetchDebts();
        }
        // storing total spent in local storage for now
        const savedTotalSpent = localStorage.getItem("totalSpent");
        if (savedTotalSpent) {
            setTotalSpent(parseFloat(savedTotalSpent));
        }
    }, [user, householdId]);

    const fetchDebts = async () => {
        if (!householdId || !user) return;

        try {
            const response = await fetch(`http://localhost:6969/payment/debts/${householdId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const e = calculateExpenses(data, user.id)
            setExpenses(e);

        } catch (error) {
            console.error('Error fetching debts:', error);
        }
    };

    const calculateExpenses = (debts: Debt[], currentUserId: string): Expense[] => {
        const expensesMap: Record<string, Expense> = {};

        debts.forEach((debt: any) => {
            const { owedBy, owedTo, amount } = debt;
            const isOwedByCurrentUser = owedBy._id === currentUserId;
            const isOwedToCurrentUser = owedTo._id === currentUserId;

            // Determine the roommate and category (owesYou or youOwe)
            if (isOwedByCurrentUser) {
                if (!expensesMap[owedTo._id]) {
                    expensesMap[owedTo._id] = {
                        roommateId: owedTo._id,
                        roommateName: owedTo.username,
                        owesYou: 0,
                        youOwe: 0
                    };
                }
                expensesMap[owedTo._id].youOwe += parseFloat((amount / 100).toFixed(2));
            } else if (isOwedToCurrentUser) {
                if (!expensesMap[owedBy._id]) {
                    expensesMap[owedBy._id] = {
                        roommateId: owedBy._id,
                        roommateName: owedBy.username,
                        owesYou: 0,
                        youOwe: 0
                    };
                }
                expensesMap[owedBy._id].owesYou += parseFloat((amount / 100).toFixed(2));
            }
        });

        // Convert the map to an array
        return Object.values(expensesMap);
    };

    const handlePayment = (amount: number) => {
        const updatedTotalSpent = totalSpent + amount;
        setTotalSpent(updatedTotalSpent);

        // Save the updated total spent to local storage
        localStorage.setItem("totalSpent", updatedTotalSpent.toString());
    };


    return (
        <div className="relative">
            <Alerts />
            { /* <h1>household id: {householdId}</h1> */}
            { /* <h1>user id: {user?.id}</h1> */}
            <h1 className="expenses-title">My Expenses</h1>

            <div className="summary-container">
                <PayStat expenses={expenses} totalSpent={totalSpent} />
            </div>

            <div className="flex flex-wrap justify-between gap-4">
                {expenses.map((expense) => (
                    // <ExpenseCard
                    //     key={expense.id}
                    //     id={expense.id}
                    //     owedTo={expense.owedTo}
                    //     owedFrom={expense.owedFrom}
                    // />
                    <ExpenseCard
                        key={expense.roommateId}
                        roommateId={expense.roommateId}
                        roommateName={expense.roommateName}
                        owesYou={expense.owesYou}
                        youOwe={expense.youOwe}

                        // refresh debts
                        // onPaymentSuccess={fetchDebts}

                        onPaymentSuccess={(amount) => {
                            fetchDebts();
                            handlePayment(amount);  // Update total spent
                        }}
                    />
                ))}
            </div>
        </div>


    );
}