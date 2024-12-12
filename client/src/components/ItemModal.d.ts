import React from 'react';
import './ItemModal.css';
interface ItemModalProps {
    item: any;
    listType: string;
    roommates: any[];
    currentUserId: string;
    onClose: () => void;
    onSave: (itemData: any) => void;
}
declare const ItemModal: React.FC<ItemModalProps>;
export default ItemModal;
