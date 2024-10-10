import React from 'react';
import './ItemCard.css';

interface ItemCardProps {
    id: string;
    category: string;
    name: string;
    price: number;
    sharedBy: string[];
    addedBy: string;
    expiryDate: string;
    isExpiringSoon: boolean;
    onDelete: () => void;
    onMove: () => void;
    listType: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
    id,
    category,
    name,
    price,
    sharedBy,
    addedBy,
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
                <span className="price">${price.toFixed(2)}</span>
            </div>
            <div className="shared-by-text">
                Shared by {sharedBy.length > 0 ? sharedBy.join(', ') : 'No one'}
            </div>
            <div className="footer">
                <div>Added by {addedBy}</div>
                <div className="expiry">Expires {expiryDate}</div>
            </div>
            <div className="actions">
                <button className="action-button" onClick={onDelete}>Delete</button>
                <button className="action-button" onClick={onMove}>
                    {listType === 'grocery' ? 'Purchase' : 'Repurchase'}
                </button>
            </div>
        </div>
    );
};

export default ItemCard;