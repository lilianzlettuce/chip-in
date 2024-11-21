import React, { useEffect, useState, memo } from 'react';
import './UtilityCard.css';

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

const UtilityCard: React.FC<UtilityCardProps> = memo(({
    category,
    amount,
    paid,
    view,
    unpaidUsernames,
    onUpdateUtility,
    onPayUtility,
    onResetUtility,
    onToggleView,
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newAmount, setNewAmount] = useState<string>(amount.toString());
    const [displayAmount, setDisplayAmount] = useState<number>(amount);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    useEffect(() => {
        setShowConfirmation(false);
    }, [view]);    

    useEffect(() => {
        setDisplayAmount(paid ? 0 : amount);
    }, [amount, paid]);

    const handleUpdateAmount = () => {
        const validAmount = parseFloat(newAmount) || 0;
        onUpdateUtility(category, validAmount);
        setIsEditing(false);
    };

    const handlePayOrReset = () => {
        if (paid) {
            setShowConfirmation(true);
        } else {
            onPayUtility(category);
            setDisplayAmount(0);
        }
    };

    const confirmReset = () => {
        onResetUtility(category);
        setShowConfirmation(false);
    };

    const cancelReset = () => {
        setShowConfirmation(false);
    };

    const handleToggleView = () => {
        onToggleView(category, view);
    };

    return (
        <div className={`utility-card ${view ? '' : 'utility-hidden'}`}>
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
                    title={view ? 'Do not track utility' : 'Track utility'}
                    disabled={!view && showConfirmation}
                >
                    👁️‍🗨️
                </button>
            </div>
            <h3 className="utility-category">{category}</h3>
            <div className={`utility-status ${paid ? 'paid' : 'unpaid'}`}>
                Status: {paid ? 'Paid' : 'Unpaid'}
            </div>
            <p className="utility-amount">
                Amount due: ${displayAmount.toFixed(2)}
            </p>
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
            {showConfirmation && (
                <div className="utility-confirmation">
                    <p className="confirmation-message">
                        {unpaidUsernames.length > 0 ? (
                            <>
                                Not all roommates have paid the bill yet:{' '}
                                <span className="unpaid-usernames">
                                    {unpaidUsernames.join(', ')}
                                </span>{' '}
                                need to pay. Do you still want to reset the bill?
                            </>
                        ) : (
                            'All roommates have paid the bill. Do you want to reset the bill?'
                        )}
                    </p>
                    <div className="utility-confirm-buttons">
                        <button
                            onClick={confirmReset}
                            className="utility-confirm-button confirm-yes"
                        >
                            ✓
                        </button>
                        <button
                            onClick={cancelReset}
                            className="utility-confirm-button confirm-no"
                        >
                            ｘ
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
});

export default UtilityCard;