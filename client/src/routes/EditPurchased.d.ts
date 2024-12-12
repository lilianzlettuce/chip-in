import React from 'react';
import './AddItem.css';
type EditPurchasedItemModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    item: any;
};
declare const EditPurchasedItemModal: React.FC<EditPurchasedItemModalProps>;
export default EditPurchasedItemModal;
