import React, { useState } from 'react';
import { useUserContext } from '../UserContext';
import { useParams } from 'react-router-dom';
import './ExpenseCard.css'

interface ExpenseCardProps {
    roommateName: string;
    roommateId: string,
    owesYou: number;
    youOwe: number;
    onPaymentSuccess: (amount: number) => void; // refresh debts

}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
    roommateName,
    roommateId,
    owesYou,
    youOwe,
    onPaymentSuccess
}) => {
    const { user } = useUserContext();
    const { householdId } = useParams();
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState<number | undefined>(); // useState<number>(0); // State for custom payment
    const [isPayByAmount, setIsPayByAmount] = useState(false); // Toggle for pay by amount
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [nudgeMessage, setNudgeMessage] = useState('');
    const [nudgeAmount, setNudgeAmount] = useState<number | undefined>();
    const [errorMessage, setErrorMessage] = useState(false);

    // Get env vars
    const PORT = process.env.REACT_APP_PORT || 6969;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

    if (!user) return;

    // handling pay back button and modal
    const handlePayBackClick = () => {
        setIsPayModalOpen(true);
    }
    const closePayModal = () => {
        setIsPayModalOpen(false);
        setIsPayByAmount(false);
    };

    //handle nudge modal
    const handleNudgeClick = () => {
        setIsNudgeModalOpen(true)
    }

    const closeNudgeModal = () => {
        setIsNudgeModalOpen(false);
    }
    const handleNudgeSubmit = async () => {
        let nudge = {
            householdId: householdId,
            recipientId: roommateId,
            nudgerId: user.id,
            message: nudgeMessage,
            amount: nudgeAmount
        }
        try {
            const response = await fetch(`${SERVER_URL}/alert/nudge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nudge),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching debts:', error);
        }

        closeNudgeModal();
    }

    // handling full payment
    const handlePayInFull = async () => {
        if (!householdId) return;
        try {
            const response = await fetch(`${SERVER_URL}/payment/payall/${householdId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owedById: user.id,
                    owedToId: roommateId
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error paying in full:', error);
        }
        closePayModal();
        setIsConfirmationOpen(true);
        onPaymentSuccess(youOwe);
    };


    // handling partial payment
    const handlePayByAmountSubmit = async () => {
        if (!paymentAmount || paymentAmount <= 0 || paymentAmount > youOwe) {
            //alert('Please enter a valid amount.');
            setErrorMessage(true);
            return;
        }
        if (!householdId) return;
        try {
            const response = await fetch(`${SERVER_URL}/payment/partialpay/${householdId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owedById: user.id,
                    owedToId: roommateId,
                    amount: paymentAmount * 100
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error paying in partial:', error);
        }
        closePayModal();
        setIsConfirmationOpen(true);
        onPaymentSuccess(paymentAmount);
    };

    const closeConfirmation = () => {
        setIsConfirmationOpen(false);
        setIsPayByAmount(false);
    };

    return (
        <div className="expense-card">
            <div className="expense-header">
                <div className="user-info">
                    <h4>@{roommateName}</h4>
                </div>
            </div>

            <div className="expense-status">
                {owesYou === 0 && youOwe === 0 ? (
                    <div className="status-item no-debts">No debts</div>
                ) : (
                    <>
                        {owesYou > 0 && (
                            <div className="status-item owes-you">Owes you <strong>${owesYou}</strong></div>
                        )}
                        {youOwe > 0 && (
                            <div className="status-item you-owe">You owe <strong>${youOwe}</strong></div>
                        )}
                    </>
                )}
            </div>

            <div className="expense-actions">
                <button className="pay-back-btn" onClick={handlePayBackClick} disabled={youOwe <= 0}>Pay back</button>
                {/* <button className="nudge-btn" onClick={handleNudgeClick}>Nudge</button> */}
            </div>
            <div className="expense-actions">
                <button className="nudge-btn" onClick={handleNudgeClick} disabled={owesYou <= 0}>Nudge</button>
            </div>

            {/* payment modal */}
            {isPayModalOpen && (
                <div className="bg-black/50 w-screen h-screen fixed top-0 left-0 flex items-center justify-center z-30">
                    <div className="expense-modal-content">
                        <h3>Pay back ${youOwe}</h3>
                        <p>Select an option:</p>

                        {/* pay in full button */}
                        <button className="pay-in-full-btn" onClick={handlePayInFull}>
                            Pay All
                        </button>

                        {/* pay by amount button */}
                        {!isPayByAmount && (
                            <button
                                className="pay-by-amount-btn"
                                onClick={() => setIsPayByAmount(true)}
                            >
                                Pay Custom Amount
                            </button>
                        )}

                        {/* input field for pay by amount */}
                        {isPayByAmount && (
                            <div className="pay-by-amount-section">
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    step="0.01"
                                    value={paymentAmount}
                                    // onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    onChange={(e) => setPaymentAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                                <button onClick={handlePayByAmountSubmit}>Pay</button>
                            </div>
                        )}

                        <button className="bg-red-400" onClick={closePayModal}>Close</button>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="error-modal-overlay">
                    <div className="error-modal-content">
                        <h3>Please enter a valid amount.</h3>
                        <button onClick={() => setErrorMessage(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* confirmation popup */}
            {isConfirmationOpen && (
                <div className="expense-modal">
                    <div className="expense-modal-content">
                        <h3>Payment Successful!</h3>
                        <p>Your payment has been processed.</p>
                        <button onClick={closeConfirmation}>Close</button>
                    </div>
                </div>
            )}

            {/* Nudge Modal */}
            {isNudgeModalOpen && (
                <div className="nudge-modal">
                    <div className="nudge-modal-content">
                        <h3>Nudge</h3>
                        <label>
                            Custom Message:
                            <textarea
                                //type="text"
                                value={nudgeMessage}
                                onChange={(e) => setNudgeMessage(e.target.value)}
                                placeholder='Enter message here'
                            ></textarea>
                        </label>
                        <label>
                            Request Amount:
                            <input
                                //className="text-white"
                                type="number"
                                step="0.01"
                                value={nudgeAmount || ""}
                                onChange={(e) => setNudgeAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                        </label>
                        <button onClick={handleNudgeSubmit}>Nudge</button>
                        <button onClick={closeNudgeModal}>Close</button>
                    </div>
                </div>
            )}

        </div>

    );
};

export default ExpenseCard;
