import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AddItem.css';

type EditGroceryItemModalProps = {
  onClose: () => void;
  onSave: (itemData: any) => void;
  item: any;
  roommates: Array<{ _id: string; name: string }>; // Array of roommate objects
};

const EditGroceryItemModal: React.FC<EditGroceryItemModalProps> = ({ onClose, onSave, roommates, item }) => {
  // const [name, setName] = useState('');
  // const [category, setCategory] = useState('');
  // const [sharedBetween, setSharedBetween] = useState<string[]>([]);
  // const [purchasedBy, setPurchasedBy] = useState('');
  console.log("NAME!!!");
    console.log(item.purchasedBy);
    console.log("SHARED BY!!!")
    console.log(item.sharedBetween)
  const [newName, setNewName] = useState(item.name);
  const [newCategory, setNewCategory] = useState(item.category);
  const [newSharedBetween, setNewSharedBetween] = useState<string[]>(item.sharedBetween || []); // useState<string[]>([]);
  const [newPurchasedBy, setNewPurchasedBy] = useState(item.purchasedBy);

  const { householdId } = useParams();

  useEffect(() => {
    if (item) {
        setNewName(item.name);
        setNewCategory(item.category);
        setNewSharedBetween(item.sharedBetween || []);
        setNewPurchasedBy(item.purchasedBy);
    }
    
  }, [item]);

  console.log("new purchased by: ", newPurchasedBy, item.purchasedBy);
  console.log("new shared by: ", newSharedBetween)
 
  // Function to handle checkbox changes for sharedBetween
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setNewSharedBetween((prev) =>
      checked ? [...prev, value] : prev.filter((roommate) => roommate !== value)
    );
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRoommate = e.target.value; // Set the selected roommate as the purchaser
    // setSharedBetween((prev) => prev.filter((roommate) => roommate !== purchasedBy));
    console.log("selected-roommate: ", selectedRoommate);
    setNewPurchasedBy(selectedRoommate);

  };

  // Function to handle form submission
  const handleSave = async () => {
    const purchasedId = roommates.find((roommate) => roommate.name === newPurchasedBy)?._id || null;

    const sharedIdsArray = newSharedBetween.map((name) => {
      const roommate = roommates.find((roommate) => roommate.name === name);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null);

    // Prepare requestBody with string IDs only
    const requestBody = {
      householdId: householdId,
      name: newName,
      category: newCategory,
      purchasedBy: purchasedId, // Send as strings
      sharedBetween: sharedIdsArray, // Send as strings
      purchaseDate: '',
      expirationDate: '',
      cost: 0,
    };

    onSave(requestBody); // Call onSave prop with new item data
    onClose(); // Close the modal
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
        <div className="input-group">
          <label>Assign Purchaser:</label>
          {roommates.map((roommate) => (
            <div key={roommate._id}>
              <input
                type="radio"
                value={roommate.name}
                checked={newPurchasedBy === roommate.name}
                onChange={handleRadioChange}
              />
              <label>{roommate.name}</label>
            </div>
          ))}
        </div>
        <div className="input-group">
          <label>Shared Between:</label>
          {roommates.map((roommate) => (
            <div key={roommate._id}>
              <input
                type="checkbox"
                value={roommate.name}
                checked={newSharedBetween.includes(roommate.name)}
                onChange={handleCheckboxChange}
              />
              <label>{roommate.name}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button className="submit-button" onClick={handleSave}>Save Item</button>
      </div>
    </div>
  );
};


export default EditGroceryItemModal;