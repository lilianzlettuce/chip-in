import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddItem.css';

type AddItemModalProps = {
  onClose: () => void;
  onSave: (itemData: any) => void;
  roommates: Array<{ _id: string; name: string }>; // Array of roommate objects
};

const AddItemModalGrocery: React.FC<AddItemModalProps> = ({ onClose, onSave, roommates }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sharedBetween, setSharedBetween] = useState<string[]>([]);
  const [purchasedBy, setPurchasedBy] = useState('');

  const { householdId } = useParams();

  // Function to handle checkbox changes for sharedBetween
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSharedBetween((prev) =>
      checked ? [...prev, value] : prev.filter((roommate) => roommate !== value)
    );
    /*setPurchasedBy((prev) =>
      checked ? [...prev, value] : prev.filter((roommate) => roommate !== value)
    );*/
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRoommate = e.target.value; // Set the selected roommate as the purchaser
    setSharedBetween((prev) => prev.filter((roommate) => roommate !== purchasedBy));

    setPurchasedBy(selectedRoommate);

    // Update sharedBetween state to include the selected roommate (if not already included)
    setSharedBetween((prev) => {
      if (!prev.includes(selectedRoommate)) {
        return [...prev, selectedRoommate]; // Add the selected roommate
      }
      return prev; // Return unchanged if already present
    });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Map selected roommate names to their corresponding string IDs
    /*const purchasedIdsArray = purchasedBy.map((name) => {
      const roommate = roommates.find((roommate) => roommate.name === name);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null); // Remove any null <values></values> */

    const purchasedId = roommates.find((roommate) => roommate.name === purchasedBy)?._id || null;

    const sharedIdsArray = sharedBetween.map((name) => {
      const roommate = roommates.find((roommate) => roommate.name === name);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null);

    // Prepare requestBody with string IDs only
    const requestBody = {
      householdId: householdId,
      name: name,
      category: category,
      purchasedBy: purchasedId, // Send as strings
      sharedBetween: sharedIdsArray, // Send as strings
      purchaseDate: '',
      expirationDate: '',
      cost: 0,
    };

    try {
      const response = await fetch(`http://localhost:6969/item/addtogrocery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
    }

    onSave(requestBody); // Call onSave prop with new item data
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Add New Item</h2>

        {/* Form Fields */}
        <div className="input-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input-group">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
                checked={purchasedBy === roommate.name}
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
                checked={sharedBetween.includes(roommate.name)}
                onChange={handleCheckboxChange}
              />
              <label>{roommate.name}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button className="submit-button" onClick={handleSubmit}>Save Item</button>
      </div>
    </div>
  );
};


export default AddItemModalGrocery;