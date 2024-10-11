import React, { useState } from 'react';
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
    const [expirationDate, setExpirationDate] = useState(item.expirationDate || '');
    const [selectedRoommates, setSelectedRoommates] = useState([currentUserId]); // Add current user by default

    const handleSave = () => {
        const updatedItem = {
            ...item,
            price: parseFloat(price),
            expirationDate,
            sharedBetween: selectedRoommates,
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

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{listType === 'purchased' ? 'Purchase Item' : 'Repurchase Item'}</h2>
                <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Expiration Date"
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
                        </div>
                    ))}
                </div>

                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ItemModal;