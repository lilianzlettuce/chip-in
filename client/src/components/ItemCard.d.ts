import React from 'react';
import './ItemCard.css';
interface ItemCardProps {
    id: string;
    category: string;
    name: string;
    price: number;
    sharedBy: string[];
    splits: {
        member: string;
        split: number;
    }[];
    purchasedBy: string;
    expiryDate: string;
    isExpiringSoon: boolean;
    onDelete: () => void;
    onMove: () => void;
    onEdit: () => void;
    onReturn: () => void;
    listType: string;
}
declare const ItemCard: React.FC<ItemCardProps>;
export default ItemCard;
