import React from 'react';
import './AddItem.css';
type AddItemModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    roommates: Array<{
        _id: string;
        name: string;
    }>;
};
declare const AddItemModal: React.FC<AddItemModalProps>;
export default AddItemModal;
