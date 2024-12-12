import React from 'react';
import './PayStat.css';
interface Expense {
    owesYou: number;
    youOwe: number;
}
interface PayStatProps {
    expenses: Expense[];
    totalSpent: number;
}
declare const PayStat: React.FC<PayStatProps>;
export default PayStat;
