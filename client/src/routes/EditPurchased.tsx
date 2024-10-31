import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AddItem.css';

type EditPurchasedItemModalProps = {
  onClose: () => void;
  onSave: (itemData: any) => void;
  item: any;
  //name: any;
  //category: string;
};

const EditPurchasedItemModal: React.FC<EditPurchasedItemModalProps> = ({ onClose, onSave, item}) => {
  //const [name, setName] = useState('');
  //const [category, setCategory] = useState('');

  const [newName, setNewName] = useState(item.name);
  const [newCategory, setNewCategory] = useState(item.category);

  useEffect(() => {
    setNewName(item.name);
    setNewCategory(item.category);
  }, [item]);
    
  const handleSave = () => {
    const updatedItem = {
        name: newName,
        category: newCategory,
    };
    onSave(updatedItem);
    onClose();
  };  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Edit Item</h2>

        {/* Form Fields */}
        <div className="input-group">
          <label>Name:</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Category:</label>
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Drink">Drink</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Toiletries">Toiletries</option>
            <option value="Pet">Pet</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button className="submit-button" onClick={handleSave}>Save Item</button>
      </div>
    </div>
  );
};

export default EditPurchasedItemModal;