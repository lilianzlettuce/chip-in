import React from 'react';
import './AddRecipe.css';
type AddRecipeModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    filteredIngredients: Array<{
        _id: string;
        name: string;
    }>;
};
declare const AddRecipeModal: React.FC<AddRecipeModalProps>;
export default AddRecipeModal;
