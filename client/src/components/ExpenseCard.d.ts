import React from 'react';
import './ExpenseCard.css';
interface ExpenseCardProps {
    roommateName: string;
    roommateId: string;
    owesYou: number;
    youOwe: number;
    onPaymentSuccess: (amount: number) => void;
}
declare const ExpenseCard: React.FC<ExpenseCardProps>;
export default ExpenseCard;
