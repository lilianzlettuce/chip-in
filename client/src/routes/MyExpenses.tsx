import { useParams } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import ExpenseCard from '../components/ExpenseCard';
import React, { useEffect, useState } from 'react';
import './MyExpenses.css'

export default function MyExpenses() {
    const { householdId} = useParams();
    const { user } = useUserContext();
    //const [expenses, setExpenses] = useState([]);
    const expenses = [
        { id: '1', owedTo: 90, owedFrom: 5 },
        { id: '2', owedTo: 120, owedFrom: 30 },
    ];
    
    return (
        <div>
            { /* <h1>household id: {householdId}</h1> */}
            { /* <h1>user id: {user?.id}</h1> */}
            <h1 className="expenses-title">My Expenses</h1>
            {expenses.map((expense) => (
                <ExpenseCard
                key={expense.id}
                id={expense.id}
                owedTo={expense.owedTo}
                owedFrom={expense.owedFrom}
                />
            ))}
        </div>
    
       
    );
}