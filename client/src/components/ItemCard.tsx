import React, { useState } from 'react';
import { useUserContext } from '../UserContext';
import './ItemCard.css';

interface ItemCardProps {
    id: string;
    category: string;
    name: string;
    price: number;
    sharedBy: string[];
    purchasedBy: string;
    expiryDate: string;
    isExpiringSoon: boolean;
    onDelete: () => void;
    onMove: () => void;
    listType: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
    category,
    name,
    price,
    sharedBy,
    purchasedBy,
    expiryDate,
    isExpiringSoon,
    onDelete,
    onMove,
    listType
}) => {
    const { user } = useUserContext();
    const isShared = user ? sharedBy.includes(user.username) : false;

    if (!user) return <div>No User</div>;

    // Debugging: log to verify props
    console.log("ItemCard Props:", {
        category, name, price, sharedBy, purchasedBy, expiryDate
    });

    // Use defaults if some data is missing
    const displayPurchasedBy = purchasedBy ? purchasedBy : 'Unknown';
    const displaySharedBy = sharedBy.length > 0 ? sharedBy.join(', ') : 'No one';
    const displayPrice = price ? `$${(price / 100).toFixed(2)}` : 'N/A';
    const displayExpiry = expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A';

    return (
        <div className={`card-container ${isShared ? 'bg-neutral-900 text-white' : 'bg-slate-500 text-gray-200'} ${isExpiringSoon && 'highlight-expiring'}`}>
            <div className="category-badge">{category}</div>
            <div className="item-info">
                <span>{name}</span>
                {listType === 'purchased' && (
                    <span className="price">{displayPrice}</span>
                )}
            </div>
            <div className="shared-by-text">
                Shared by <b>{displaySharedBy}</b>
            </div>
            <div className="footer">
                <div>{listType === 'purchased' ? 'Purchased by ' : 'Assigned purchaser: '} <b>{displayPurchasedBy}</b></div>
                {listType === 'purchased' && (
                    <div className="expiry">Expires {displayExpiry}</div>
                )}
            </div>
            <div className="actions">
                <button className={`px-4 py-2 bg-gray-600 rounded-md ${isShared ? 'hover:bg-red-400' : 'hover:cursor-default'}`}
                    onClick={isShared ? onDelete : () => { }}>
                    Delete
                </button>
                <button className={`px-4 py-2 bg-gray-600 rounded-md ${isShared ? 'hover:bg-green-400' : 'hover:cursor-default'}`}
                    onClick={isShared ? onMove : () => { }}>
                    {listType === 'grocery' ? 'Purchase' : 'Repurchase'}
                </button>
            </div>
        </div>
    );
};

export default ItemCard;