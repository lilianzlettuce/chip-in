import React, { useEffect, useState } from 'react';
import './PayStat.css';

interface Expense {
    owesYou: number;
    youOwe: number;
}

interface PayStatProps {
    expenses: Expense[];
    totalSpent: number;
}

const PayStat: React.FC<PayStatProps> = ({ expenses, totalSpent }) => {
    const [totalOwed, setTotalOwed] = useState(0);

    useEffect(() => {
        const owed = expenses.reduce((acc, curr) => acc + curr.youOwe, 0);
        setTotalOwed(owed);
    }, [expenses]);

    return (
        <div className="pay-stat-summary">
            <h3>Payment Summary</h3>
            <div className="summary-metrics">
                <div>
                    <span className="metric-value">${totalSpent.toFixed(2)}</span>
                    <span className="metric-label">paid back</span>
                </div>
                <div>
                    <span className="metric-value">${totalOwed.toFixed(2)}</span>
                    <span className="metric-label">owed</span>
                </div>
            </div>
        </div>
    );
};


export default PayStat;