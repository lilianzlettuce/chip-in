import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ItemModal.css';

interface ItemModalProps {
    item: any;
    listType: string;
    roommates: any[];
    currentUserId: string;
    onClose: () => void;
    onSave: (itemData: any) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, listType, roommates, currentUserId, onClose, onSave }) => {
    const [price, setPrice] = useState(item.price || '');
    const [expirationDate, setExpirationDate] = useState(item.expirationDate ? new Date(item.expirationDate).toISOString().substring(0, 10) : '');
    const [selectedRoommates, setSelectedRoommates] = useState([currentUserId]);
    const [roommatePerc, setRoommatePerc] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const totalPercentage = Object.values(roommatePerc)
            .map((value) => parseFloat(value) || 0)
            .reduce((sum, value) => sum + value, 0);
    
        const allEmpty = Object.values(roommatePerc).every((value) => !value);
    
        if (selectedRoommates.length > 1 && allEmpty) {
            setErrorMessage('Price will be split evenly');
        } else if (selectedRoommates.length > 1 && totalPercentage !== 100) {
            setErrorMessage('The total percentage must add up to 100%');
        } else {
            setErrorMessage('');
        }
    }, [roommatePerc, selectedRoommates]);

    const handleSave = () => {
        if (errorMessage && errorMessage !== 'Price will be split evenly') return;

        const splits = Object.entries(roommatePerc).map(([roommateId, percentage]) => ({
            member: roommateId,
            split: parseFloat(percentage) / 100,
        }));

        const updatedItem = {
            ...item,
            price: parseFloat(price),
            expirationDate,
            sharedBetween: selectedRoommates,
            splits,
        };
        onSave(updatedItem);
    };

    const toggleRoommateSelection = (roommateId: string) => {
        setSelectedRoommates((prev) =>
            prev.includes(roommateId)
                ? prev.filter((id) => id !== roommateId)
                : [...prev, roommateId]
        );
    };

    const handleRoommateSplit = (roommateId: string, newPrice: string) => {
        setRoommatePerc((prev) => ({
            ...prev,
            [roommateId]: newPrice,
        }));
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" >
            <div className="modal" >
                <h2>{listType === 'purchased' ? 'Purchase Item' : 'Repurchase Item'}</h2>
                <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                />

                <div className="shared-users">
                    <h3>Select Shared Users:</h3>
                    {roommates.map((roommate) => (
                        <div key={roommate._id} className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                value={roommate._id}
                                checked={selectedRoommates.includes(roommate._id)}
                                onChange={() => toggleRoommateSelection(roommate._id)}
                            />
                            <label>{roommate.name}</label>
                            {selectedRoommates.length > 1 && selectedRoommates.includes(roommate._id) && (
                                <input
                                    type="number"
                                    placeholder="Enter custom split %"
                                    value={roommatePerc[roommate._id] || ''}
                                    onChange={(e) => handleRoommateSplit(roommate._id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <button onClick={handleSave} disabled={!!errorMessage && errorMessage !== 'Price will be split evenly'}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default ItemModal;