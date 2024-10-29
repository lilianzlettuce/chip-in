import React, { useState } from 'react';
import { useUserContext } from '../UserContext';
import { useParams } from 'react-router-dom';
import './ExpenseCard.css'

interface ExpenseCardProps {
    // id: string;
    //user:string;
    //email: string;
    // owedTo: number; // amount you owe
    // owedFrom: number; // amount roommate owes you
    // onPayBack: () => void;
    roommateName: string;
    roommateId: string,
    owesYou: number;
    youOwe: number;

}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
   //user,
    //email,
//    owedTo,
//    owedFrom,
   // onPayBack

   roommateName,
   roommateId,
   owesYou,
   youOwe
}) => { 
    const { user } = useUserContext();
    const { householdId } = useParams();
    const [isPayModalOpen, setIsPayModalOpen] = useState(false); 
    const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false); 
    const [paymentAmount, setPaymentAmount] = useState<number>(0); // State for custom payment
    const [isPayByAmount, setIsPayByAmount] = useState(false); // Toggle for pay by amount
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [nudgeMessage, setNudgeMessage] = useState('');
    const [nudgeAmount, setNudgeAmount] = useState<number | undefined>();


    if (!user) return;
    
    // handling pay back button and modal
    const handlePayBackClick = () => {
        setIsPayModalOpen(true);
    }
    const closePayModal = () => {
        setIsPayModalOpen(false);
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
            const response = await fetch(`http://localhost:6969/alert/nudge`, {
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
    const handlePayInFull = () => {
        // TODO: send request to backend to process the full payment of owedTo
        closePayModal(); 
        setIsConfirmationOpen(true);
    };


    // handling partial payment
    const handlePayByAmountSubmit = () => {
        if (paymentAmount <= 0 || paymentAmount > youOwe) {
            alert('Please enter a valid amount.');
            return;
        }
        closePayModal(); 
        setIsConfirmationOpen(true);
    };

    const closeConfirmation = () => {
        setIsConfirmationOpen(false);
        setIsPayByAmount(false);
    };

    return (
        <div className="expense-card">
            <div className="expense-header">
                <div className="user-info">
                {/* <h4>@{user.username}</h4>
                <h4>{user.email}</h4> */}
                <h4>@{roommateName}</h4>
                </div>
            </div>

            <div className="expense-status">
                <div className="status-item owes-you">Owes you <strong>${owesYou}</strong></div>
                <div className="status-item you-owe">You owe <strong>${youOwe}</strong></div>
            </div>

            <div className="expense-actions">
                <button className="pay-back-btn" onClick={handlePayBackClick}>Pay back</button>
                {/* <button className="nudge-btn" onClick={handleNudgeClick}>Nudge</button> */}
            </div>
            <div className="expense-actions">
                <button className="nudge-btn" onClick={handleNudgeClick}>Nudge</button>
            </div>

            {/* payment modal */}
            {isPayModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Pay back ${youOwe}</h3>
                        <p>Select an option:</p>

                        {/* pay in full button */}
                        <button className="pay-in-full-btn" onClick={handlePayInFull}>
                            Pay in Full
                        </button>

                        {/* pay by amount button */}
                        {!isPayByAmount && (
                            <button 
                                className="pay-by-amount-btn" 
                                onClick={() => setIsPayByAmount(true)}
                            >
                                Pay by Amount
                            </button>
                        )}

                        {/* input field for pay by amount */}
                        {isPayByAmount && (
                            <div className="pay-by-amount-section">
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                />
                                <button onClick={handlePayByAmountSubmit}>Pay</button>
                            </div>
                        )}

                        <button onClick={closePayModal}>Close</button>
                    </div>
                </div>
            )}

            {/* confirmation popup */}
            {isConfirmationOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Payment Successful!</h3>
                        <p>Your payment has been processed.</p>
                        <button onClick={closeConfirmation}>Close</button>
                    </div>
                </div>
            )}

            {/* Nudge Modal */}
            {isNudgeModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nudge</h3>
                        <label>
                            Custom Message:
                            <input
                                type="text"
                                value={nudgeMessage}
                                onChange={(e) => setNudgeMessage(e.target.value)}
                            />
                        </label>
                        <label>
                            Request Amount:
                            <input
                                type="number"
                                step="0.01"
                                value={nudgeAmount || ""}
                                onChange={(e) => setNudgeAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                        </label>
                        <button onClick={handleNudgeSubmit}>Nudge</button>
                    </div>
                </div>
            )}

        </div>

    );
};

export default ExpenseCard;
