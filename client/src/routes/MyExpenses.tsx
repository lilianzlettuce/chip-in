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
    const [householdMembers, setHouseholdMembers] = useState<User[]>([]);

    // Get env vars
    const PORT = process.env.REACT_APP_PORT || 6969;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

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
        unpaidUsernames?: string[];
    }

    interface Expense {
        roommateId: string;
        roommateName: string;
        owesYou: number;
        youOwe: number;
    }

    useEffect(() => {
        if (householdId && user) {
            fetchHouseholdMembers();
            fetchUtilities();
            fetchDebts();
        }
        // Retrieve total spent specific to this user
        const storageKey = `totalSpent_${user?.id}_${householdId}`;
        const savedTotalSpent = localStorage.getItem(storageKey);
        if (savedTotalSpent) {
            setTotalSpent(parseFloat(savedTotalSpent));
        }
    }, [householdId, user]);

    useEffect(() => {
        if (utilities.length > 0 && householdMembers.length > 0) {
            fetchUtilitiesWithUnpaidUsernames();
        }
    }, [utilities, householdMembers]);


    // const fetchDebts = async () => {
    //     if (!householdId || !user) return;

    //     try {
    //         const response = await fetch(`${SERVER_URL}/payment/debts/${householdId}`);
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

    const fetchHouseholdMembers = async () => {
        if (!householdId) return;

        try {
            const response = await fetch(`${SERVER_URL}/household/members/${householdId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch household members');
            }
            const data: User[] = await response.json();
            setHouseholdMembers(data);
        } catch (error) {
            console.error('Error fetching household members:', error);
        }
    };

    const fetchDebts = async () => {
        if (!householdId || !user) return;

        try {
            const response = await fetch(`${SERVER_URL}/payment/debts/${householdId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
                `${SERVER_URL}/utilities/${householdId}/${user.id}`,
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
                `${SERVER_URL}/utilities/update-amount/${householdId}`,
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
                `${SERVER_URL}/utilities/pay/${householdId}`,
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
                    utility.category === category ? { ...utility, paid: true } : utility
                )
            );
        } catch (error) {
            console.error('Error paying utility:', error);
        }
    };

    const fetchUtilitiesWithUnpaidUsernames = async () => {
        if (!householdId || utilities.length === 0 || householdMembers.length === 0) return;

        try {
            const updatedUtilities = await Promise.all(
                utilities.map(async (utility) => {
                    const response = await fetch(
                        `${SERVER_URL}/utilities/unpaid/${householdId}/${utility.category}`
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch unpaid usernames');
                    }
                    const unpaidUsernames: string[] = await response.json();
                    return { ...utility, unpaidUsernames };
                })
            );

            if (JSON.stringify(updatedUtilities) !== JSON.stringify(utilities)) {
                setUtilities(updatedUtilities);
            }
        } catch (error) {
            console.error('Error fetching utilities with unpaid usernames:', error);
        }
    };

    const handleResetUtility = async (category: string) => {
        if (!user || !householdId) return;

        try {
            const response = await fetch(
                `${SERVER_URL}/utilities/reset/${householdId}`,
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

            setUtilities((prev) =>
                prev.map((utility) =>
                    utility.category === category && utility.owedBy === user.id
                        ? { ...utility, paid: false }
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
            ? `${SERVER_URL}/utilities/hide/${householdId}`
            : `${SERVER_URL}/utilities/view/${householdId}`;

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

            setUtilities((prevUtilities) =>
                prevUtilities.map((utility) =>
                    utility.category === category
                        ? { ...utility, view: !currentView }
                        : utility
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
                            unpaidUsernames={utility.unpaidUsernames || []}
                            onUpdateUtility={handleUpdateUtility}
                            onPayUtility={handlePayUtility}
                            onResetUtility={handleResetUtility}
                            onToggleView={handleToggleView}
                        />
                    ))
                ) : (
                    <div className="no-utilities-message">
                        No utilities available for this household.
                    </div>
                )}
            </div>
        </div>
    );
}