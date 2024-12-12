import React from 'react';
import './UtilityCard.css';
import './ItemCard.css';
interface UtilityCardProps {
    category: string;
    amount: number;
    paid: boolean;
    view: boolean;
    unpaidUsernames: string[];
    onUpdateUtility: (category: string, newAmount: number) => void;
    onPayUtility: (category: string) => void;
    onResetUtility: (category: string) => void;
    onToggleView: (category: string, currentView: boolean) => void;
}
declare const UtilityCard: React.FC<UtilityCardProps>;
export default UtilityCard;
