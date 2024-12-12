import React from 'react';
import './AddItem.css';
type EditGroceryItemModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    item: any;
    roommates: Array<{
        _id: string;
        name: string;
    }>;
};
declare const EditGroceryItemModal: React.FC<EditGroceryItemModalProps>;
export default EditGroceryItemModal;
