import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddItem.css';

type AddItemModalProps = {
  onClose: () => void;
  onSave: (itemData: any) => void;
  roommates: Array<{ _id: string; name: string }>; // Array of roommate objects
};

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSave, roommates }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchasedBy, setPurchasedBy] = useState<string[]>([]);
  const [sharedBetween, setSharedBetween] = useState<string[]>([]);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cost, setCost] = useState('');

  const { householdId } = useParams();

  // Function to handle checkbox changes for sharedBetween
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSharedBetween((prev) =>
      checked ? [...prev, value] : prev.filter((roommate) => roommate !== value)
    );
    setPurchasedBy((prev) =>
      checked ? [...prev, value] : prev.filter((roommate) => roommate !== value)
    );
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Map selected roommate names to their corresponding string IDs
    const purchasedIdsArray = purchasedBy.map((name) => {
      const roommate = roommates.find((roommate) => roommate.name === name);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null); // Remove any null values

    const sharedIdsArray = sharedBetween.map((name) => {
      const roommate = roommates.find((roommate) => roommate.name === name);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null);

    // Prepare requestBody with string IDs only
    const requestBody = {
      householdId: householdId,
      name: name,
      category: category,
      purchasedBy: purchasedIdsArray[0], // Send as strings
      sharedBetween: sharedIdsArray, // Send as strings
      purchaseDate: purchaseDate,
      expirationDate: expirationDate,
      cost: cost,
    };

    try {
      const response = await fetch(`http://localhost:6969/item/addtopurchased`, {
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
         <label>Category:</label>
         <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
       </div>
       <div className="input-group">
         <label>Purchased By:</label>
         {roommates.map((roommate) => (
           <div key={roommate._id}>
             <input
               type="radio"
               value={roommate.name}
               checked={purchasedBy.includes(roommate.name)}
               onChange={handleCheckboxChange}
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
       <div className="input-group">
         <label>Purchase Date:</label>
         <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
       </div>
       <div className="input-group">
         <label>Expiration Date:</label>
         <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
       </div>
       <div className="input-group">
         <label>Cost:</label>
         <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
       </div>
      
       {/* Submit Button */}
       <button className="submit-button" onClick={handleSubmit}>Save Item</button>
     </div>
   </div>
 );
};


export default AddItemModal;