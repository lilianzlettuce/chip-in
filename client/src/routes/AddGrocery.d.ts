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
declare const AddItemModalGrocery: React.FC<AddItemModalProps>;
export default AddItemModalGrocery;
