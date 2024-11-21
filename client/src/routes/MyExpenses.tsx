import { useParams } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { useEffect, useState } from 'react';

import PayStat from '../components/PayStat';
import ExpenseCard from '../components/ExpenseCard';
import Alerts from '../components/Alerts';
import UtilityCard from '../components/UtilityCard';

import './MyExpenses.css'

export default function MyExpenses() {
    const { householdId } = useParams();
    const { user } = useUserContext();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [utilities, setUtilities] = useState<Utility[]>([]);

    interface User {
        _id: string;
        username: string;
    }

    interface Debt {
        owedBy: User;
        owedTo: User;
        amount: number;
    }

    interface Utility {
        category: string;
        amount: number;
        paid: boolean;
        view: boolean;
        owedBy: string;
        _id: string;
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
            if (user?.id) {
                fetchUtilities();
            }
        }

        // Retrieve total spent specific to this user
        const storageKey = `totalSpent_${user?.id}_${householdId}`;
        const savedTotalSpent = localStorage.getItem(storageKey);
        if (savedTotalSpent) {
            setTotalSpent(parseFloat(savedTotalSpent));
        }
    }, [user, householdId]);

    // const fetchDebts = async () => {
    //     if (!householdId || !user) return;

    //     try {
    //         const response = await fetch(`http://localhost:6969/payment/debts/${householdId}`);
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();

    //         const e = calculateExpenses(data, user.id)
    //         setExpenses(e);

    //     } catch (error) {
    //         console.error('Error fetching debts:', error);
    //     }
    // };

    const fetchDebts = async () => {
        if (!householdId || !user) return;

        try {
            // Make a PATCH request to update debts
            const response = await fetch(`http://localhost:6969/payment/debts/${householdId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Include an empty body or relevant data if needed
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Calculate expenses based on the updated data
            const e = calculateExpenses(data, user.id);
            setExpenses(e);

        } catch (error) {
            console.error('Error fetching and updating debts:', error);
        }
    };

    const fetchUtilities = async () => {
        if (!householdId || !user) return;

        try {
            const response = await fetch(
                `http://localhost:6969/utilities/${householdId}/${user.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Utility[] = await response.json();
            setUtilities(data);
        } catch (error) {
            console.error('Error fetching utilities:', error);
            setUtilities([]);
        }
    };

    const calculateExpenses = (debts: Debt[], currentUserId: string): Expense[] => {
        const expensesMap: Record<string, Expense> = {};

        debts.forEach((debt: Debt) => {
            const { owedBy, owedTo, amount } = debt;

            //if (!owedBy || !owedTo) return;

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

        return Object.values(expensesMap);
    };

    const handlePayment = (amount: number) => {
        const updatedTotalSpent = totalSpent + amount;
        setTotalSpent(updatedTotalSpent);

        if (user?.id && householdId) {
            const storageKey = `totalSpent_${user.id}_${householdId}`;
            localStorage.setItem(storageKey, updatedTotalSpent.toString());
        }
    };

    const handleUpdateUtility = async (category: string, newAmount: number) => {
        if (!user || !householdId) return;

        try {
            const response = await fetch(
                `http://localhost:6969/utilities/update-amount/${householdId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        category: category,
                        amount: newAmount,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setUtilities((prev) =>
                prev.map((u) =>
                    u.category === category && u.owedBy === user.id
                        ? { ...u, amount: newAmount }
                        : u
                )
            );
        } catch (error) {
            console.error('Error updating utility:', error);
        }
    };

    const handlePayUtility = async (category: string) => {
        if (!householdId || !user) return;

        try {
            const response = await fetch(
                `http://localhost:6969/utilities/pay/${householdId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, category }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setUtilities((prev) =>
                prev.map((utility) =>
                    utility.category === category ? { ...utility, paid: true, amount: 0 } : utility
                )
            );
        } catch (error) {
            console.error('Error paying utility:', error);
        }
    };

    const handleResetUtility = async (category: string) => {
        if (!user || !householdId) return;

        try {
            const response = await fetch(
                `http://localhost:6969/utilities/reset/${householdId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        category: category,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the utility state after resetting
            setUtilities((prev) =>
                prev.map((utility) =>
                    utility.category === category && utility.owedBy === user.id
                        ? { ...utility, paid: false, amount: 0 }
                        : utility
                )
            );
        } catch (error) {
            console.error('Error resetting utility:', error);
        }
    };

    const handleToggleView = async (category: string, currentView: boolean) => {
        if (!user || !householdId) return;

        const endpoint = currentView
            ? `http://localhost:6969/utilities/hide/${householdId}`
            : `http://localhost:6969/utilities/view/${householdId}`;

        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    category: category,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUtilities((prev) =>
                prev.map((u) =>
                    u.category === category && u.owedBy === user.id
                        ? { ...u, view: !currentView }
                        : u
                )
            );
        } catch (error) {
            console.error('Error toggling utility view:', error);
        }
    };

    return (
        <div className="relative">
            <Alerts />
            <h1 className="expenses-title">My Expenses</h1>

            <div className="summary-container">
                <PayStat expenses={expenses} totalSpent={totalSpent} />
            </div>

            <div className="flex flex-wrap justify-between gap-4">
                {expenses.map((expense) => (
                    <ExpenseCard
                        key={expense.roommateId}
                        roommateId={expense.roommateId}
                        roommateName={expense.roommateName}
                        owesYou={expense.owesYou}
                        youOwe={expense.youOwe}
                        onPaymentSuccess={(amount) => {
                            fetchDebts();
                            handlePayment(amount);
                        }}
                    />
                ))}
            </div>

            <div className="utility-container">
                {utilities.length > 0 ? (
                    utilities.map((utility) => (
                        <UtilityCard
                            key={utility._id}
                            category={utility.category}
                            amount={utility.amount}
                            paid={utility.paid}
                            view={utility.view}
                            onUpdateUtility={handleUpdateUtility}
                            onPayUtility={handlePayUtility}
                            onResetUtility={handleResetUtility}
                            onToggleView={handleToggleView}
                        />
                    ))
                ) : (
                    <p>No utilities available for this household.</p>
                )}
            </div>
        </div>
    );
}