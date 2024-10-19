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
    if (!user) return;

    const [isShared] = useState(sharedBy.includes(user.username));

    return (
        <div className={`card-container ${isShared ? 'bg-neutral-900 text-white' : 'bg-slate-500 text-gray-200'} ${isExpiringSoon && 'highlight-expiring'}`}>
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
                {listType == 'purchased' &&
                    <div className="expiry">Expires {expiryDate}</div>
                }  
            </div>
            <div className="actions">
                <button className={`px-4 py-2 bg-gray-600 rounded-md ${isShared ? 'hover:bg-red-400' : 'hover:cursor-default'}`}
                        onClick={sharedBy.includes(user.username) ? onDelete : () => {}}>   
                    Delete
                </button>
                <button className={`px-4 py-2 bg-gray-600 rounded-md ${isShared ? 'hover:bg-green-400' : 'hover:cursor-default'}`} 
                        onClick={sharedBy.includes(user.username) ? onMove : () => {}}> 
                    {listType === 'grocery' ? 'Purchase' : 'Repurchase'}
                </button>
            </div>
        </div>
    );
};

export default ItemCard;