import React from 'react';
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
    return (
        <div className={`card-container ${isExpiringSoon ? 'highlight-expiring' : ''}`}>
            <div className="category-badge">{category}</div>
            <div className="item-info">
                <span>{name}</span>
                {listType == 'purchased' &&
                    <span className="price">${price.toFixed(2)}</span>
                }
            </div>
            <div className="shared-by-text">
                Shared by <b>{sharedBy.length > 0 ? sharedBy.join(', ') : 'No one'}</b>
            </div>
            <div className="footer">
                <div>{listType == 'purchased' ? 'Purchased by ' : 'Assigned purchaser: '} <b>{purchasedBy}</b></div>
                <div className="expiry">Expires {expiryDate}</div>
            </div>
            <div className="actions">
                <button className="px-4 py-2 bg-gray-600 rounded-md hover:bg-red-400" onClick={onDelete}>Delete</button>
                <button className="px-4 py-2 bg-gray-600 rounded-md hover:bg-green-400" onClick={onMove}>
                    {listType === 'grocery' ? 'Purchase' : 'Repurchase'}
                </button>
            </div>
        </div>
    );
};

export default ItemCard;