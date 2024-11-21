import React, { useState } from 'react';
import './UtilityCard.css';

interface UtilityCardProps {
    category: string;
    amount: number;
    paid: boolean;
    view: boolean;
    onUpdateUtility: (category: string, newAmount: number) => void;
    onPayUtility: (category: string) => void;
    onResetUtility: (category: string) => void;
    onToggleView: (category: string, currentView: boolean) => void;
}

const UtilityCard: React.FC<UtilityCardProps> = ({
    category,
    amount,
    paid,
    view,
    onUpdateUtility,
    onPayUtility,
    onResetUtility,
    onToggleView,
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newAmount, setNewAmount] = useState<string>(amount.toString());

    const handleUpdateAmount = () => {
        const validAmount = parseFloat(newAmount) || 0;
        onUpdateUtility(category, validAmount);
        setIsEditing(false);
    };

    const handlePayOrReset = () => {
        if (paid) {
            onResetUtility(category);
        } else {
            onPayUtility(category);
        }
    };

    const handleToggleView = () => {
        onToggleView(category, view);
    };

    return (
        <div className={`utility-card ${!view ? 'utility-hidden' : ''}`}>
            <div className="utility-actions">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="utility-button"
                    title="Edit bill amount"
                    disabled={!view}
                >
                    ✏️
                </button>
                <button
                    onClick={handlePayOrReset}
                    className="utility-button"
                    title={paid ? 'Reset bill' : 'Pay bill'}
                    disabled={!view}
                >
                    {paid ? '🔄' : '💰'}
                </button>
                <button
                    onClick={handleToggleView}
                    className="utility-button"
                    title={view ? 'Hide this utility' : 'Show this utility'}
                >
                    👁️‍🗨️
                </button>
            </div>
            <h3 className="utility-category">{category}</h3>
            <div className={`utility-status ${paid ? 'paid' : 'unpaid'}`}>
                Status: {paid ? 'Paid' : 'Unpaid'}
            </div>
            <div className="utility-amount">Amount due: ${amount.toFixed(2)}</div>
            {isEditing && (
                <div className="utility-edit">
                    <p className="utility-edit-text">Enter monthly bill for this utility:</p>
                    <div className="utility-edit-row">
                        <input
                            type="text"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            className="utility-input"
                        />
                        <button onClick={handleUpdateAmount} className="utility-button">
                            ✓
                        </button>
                    </div>
                </div>
            )}
            <div className="utility-bottom-content">
                {category === 'Water' && <span role="img" aria-label="Water">💧</span>}
                {category === 'Electricity' && <span role="img" aria-label="Electricity">⚡</span>}
                {category === 'Internet' && <span role="img" aria-label="Internet">📶</span>}
            </div>
        </div>
    );
};

export default UtilityCard;