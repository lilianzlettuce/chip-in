import React, { useState } from 'react';
import { useUserContext } from '../UserContext';
import './ItemCard.css';

interface ItemCardProps {
    id: string;
    category: string;
    name: string;
    price: number;
    sharedBy: string[];
    splits: { member: string; split: number }[];
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
    splits,
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

    console.log("ItemCard Props:", {
        category, name, price, sharedBy, purchasedBy, expiryDate
    });

    const displayPurchasedBy = purchasedBy ? purchasedBy : 'Unknown';
    const displaySharedBy = sharedBy.length > 0 ? sharedBy.join(', ') : 'No one';
    const displayPrice = price ? `$${(price).toFixed(2)}` : 'N/A';
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
            {/* <div className="shared-by-text">
                Shared by <b>{displaySharedBy}</b>
            </div> */}
            <div>
                Shared by{' '}
                {sharedBy.length > 0 ? (
                    sharedBy.map((username, index) => {
                    let splitAmount = ((splits.find((split) => split.member === username)?.split || 0) * price).toFixed(2);
                    if (sharedBy.length == 1) {splitAmount = String(price.toFixed(2))}
                    return (
                        <span key={index} className="shared-user">
                            {username}
                            <span className="custom-tooltip">Split: ${splitAmount}</span>
                            {index < sharedBy.length - 1 ? ', ' : ''}
                        </span>
                    );
                })
                ) : (
                    'No one'
                )}
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