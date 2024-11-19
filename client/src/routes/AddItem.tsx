import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddItem.css';

type AddItemModalProps = {
  onClose: () => void;
  onSave: (itemData: any) => void;
  roommates: Array<{ _id: string; name: string }>;
};

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSave, roommates }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchasedBy, setPurchasedBy] = useState('');
  const [sharedBetween, setSharedBetween] = useState<string[]>([]);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [roommatePerc, setRoommatePerc] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');

  const { householdId } = useParams();

  useEffect(() => {
    const totalPercentage = Object.values(roommatePerc)
      .map((value) => parseFloat(value) || 0)
      .reduce((sum, value) => sum + value, 0);

    const allEmpty = Object.values(roommatePerc).every((value) => !value);

    if (sharedBetween.length > 1 && allEmpty) {
      setErrorMessage('Cost will be split evenly');
    } else if (sharedBetween.length > 1 && totalPercentage !== 100) {
      setErrorMessage('The total percentage must add up to 100%');
    } else {
      setErrorMessage('');
    }
  }, [roommatePerc, sharedBetween]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSharedBetween((prev) => [...prev, value]);
      setRoommatePerc((prev) => ({ ...prev, [value]: '' }));
    } else {
      setSharedBetween((prev) => prev.filter((roommate) => roommate !== value));
      setRoommatePerc((prev) => {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      });
    }
  };

  const handleRoommateSplit = (roommateId: string, newPercentage: string) => {
    const value = parseFloat(newPercentage);
    setRoommatePerc((prev) => ({
      ...prev,
      [roommateId]: isNaN(value) ? '' : newPercentage,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRoommate = e.target.value;
    setPurchasedBy(selectedRoommate);
  };

  const handleSubmit = async () => {
    if (errorMessage && errorMessage !== 'Cost will be split evenly') return;

    const purchasedId = roommates.find((roommate) => roommate.name === purchasedBy)?._id || null;
    const sharedIdsArray = sharedBetween.map((id) => {
      const roommate = roommates.find((roommate) => roommate._id === id);
      return roommate ? roommate._id : null;
    }).filter((id) => id !== null);

    const splits = Object.entries(roommatePerc).map(([roommateId, percentage]) => ({
      member: roommateId,
      split: parseFloat(percentage) / 100,
    }));

    const requestBody = {
      householdId,
      name,
      category,
      purchasedBy: purchasedId,
      sharedBetween: sharedIdsArray,
      purchaseDate,
      expirationDate,
      cost,
      splits,
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

    onSave(requestBody);
    onClose();
  };

  const sharedByNames = sharedBetween
    .map((id) => {
      const roommate = roommates.find((roommate) => roommate._id === id);
      return roommate ? roommate.name : null;
    })
    .filter((name) => name !== null);

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
          <label>Purchased By:</label>
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
                value={roommate._id}
                checked={sharedBetween.includes(roommate._id)}
                onChange={handleCheckboxChange}
              />
              <label>{roommate.name}</label>
              {sharedBetween.includes(roommate._id) && (
                <input
                  type="number"
                  placeholder="Enter custom split %"
                  value={roommatePerc[roommate._id] || ''}
                  onChange={(e) => handleRoommateSplit(roommate._id, e.target.value)}
                  className="split-input"
                />
              )}
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
          <input
            type="number"
            value={cost || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setCost(isNaN(value) ? 0 : value);
            }}
          />
        </div>

        {/* Display Shared By Names */}
        <p>Shared by: {sharedByNames.length > 0 ? sharedByNames.join(' and ') : 'No one'}</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Submit Button */}
        <button className="submit-button" onClick={handleSubmit}>Save Item</button>
      </div>
    </div>
  );
};

export default AddItemModal;