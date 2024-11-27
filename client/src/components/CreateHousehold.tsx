import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';

import './CreateHousehold.css'; 
import { useUserContext } from '../UserContext';

// import { useNavigate } from 'react-router-dom';
// Modal component
type ModalProps = {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};


export const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => { 
    // Freeze background
    {/*
    useEffect(() => {
        if (show) {
          // Prevent background scroll when modal is open
          document.body.classList.add("body-no-scroll");
        } else {
          // Re-enable background scroll when modal is closed
          document.body.classList.remove("body-no-scroll");
        }
        return () => {
          document.body.classList.remove("body-no-scroll");
        };
    }, [show]);
      */}
      
      if (!show) return null;

  return ReactDOM.createPortal (
    <div className="create-modal-overlay">
      <div className="create-modal-content">
        <button className="create-close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faX} className="text-black text-lg" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement 
  );
};

interface Notification {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

// Main HouseholdForm component
type HouseholdFormProps = {
  onClose: () => void; // Function to close the modal
};

export const HouseholdForm: React.FC<HouseholdFormProps> = ({ onClose }) => {
  const [householdName, setHouseholdName] = useState("");
  const { user, setUser, updateUser} = useUserContext();
  // const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification>({ message: '', type: 'success', show: false });

  // Get server url
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  // Function to handle form submission
  //const handleSubmit = () => {
  async function handleSubmit() {
    if (!user || !user.id) {
      console.error("User or User ID is not available.");
      return; // Stop execution if user.id is not set
    }

    const newHouseholdData = {
      name: householdName,
      members: [user?.id], // like a global variable
      groceryList: [],
      purchasedList: [],
      debts: [],
      alerts: [],
      notes: [],
      recipes: [],
      purchaseHistory: []
    };
    try {
      // Create household
      const response = await fetch(`${SERVER_URL}/household/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHouseholdData), // Convert data to JSON string
      });
  
      const data = await response.json();
  
      if (response.ok) {
        updateUser();
        setNotification({ message: `Success: Household ${householdName} created`, type: 'success', show: true });
        console.log("New household created:", data);
      } else {
        setNotification({ message: `Failed: Household ${householdName} already exists`, type: 'error', show: true });
        console.error("Failed to create household:", data.error);
      }

      // Update global user variable from database
      //updateUser();
    } catch (error) {
      console.error("Error occurred while creating household:", error);
    }
    
    //alert(`Household Name: ${householdName} created \n`);
    // TBD: save householdName and uploadedFileName to server
    
    // navigate('/households/ ${householdName}') // reroute to household id??
    
    //onClose(); // Close the modal after submission
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  }

  return (
    <div>
        <img
          src="https://i.postimg.cc/Jn8hZMWm/create-house-Photoroom.png"
          alt="Create Household Logo"
          className="create-household-image"
        />
        <h3 className="create-message">
        Create a household name
        </h3>
        {/*<h3 style={{ color: 'black', display: 'block', fontSize: '16px' }}>Please enter a household name</h3>*/}
        <div className="create-modal-body">
          {/* Household Name Input */}
          <div className="create-input-group">
            <input
              type="text"
              className="create-input-field text-white"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="Household name"
            />
          </div>

          {/* Submit Button */}
          <div className="create-input-group">
            <button className="create-label-button create-submit-button" onClick={handleSubmit}>
              Create
            </button>

            {/* Notification UI */}
            {notification.show && (
              <div className={`create-notification-card ${notification.type}`}>
                {/*<button className="close-button" onClick={closeNotification}>x</button>*/}
                <p>{notification.message}</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

// export default HouseholdForm;

