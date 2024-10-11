import React, { useState, useEffect } from 'react';
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
  
      if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

// Main HouseholdForm component
type HouseholdFormProps = {
  onClose: () => void; // Function to close the modal
};

export const HouseholdForm: React.FC<HouseholdFormProps> = ({ onClose }) => {
  const [householdName, setHouseholdName] = useState("");
  const { user, setUser} = useUserContext();
  // const navigate = useNavigate();

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
        console.log("New household created:", data);
      } else {
        console.error("Failed to create household:", data.error);
      }

      // Update global user variable based on the user ID
      const userResponse = await fetch(`${SERVER_URL}/user/${user?.id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();

        if (userData.households) {
          setUser((prevUser) => ({
            ...prevUser,
            ...userData,
            id: user.id // _id to id
          }));
        }
      }
    } catch (error) {
      console.error("Error occurred while creating household:", error);
    }
    
    alert(`Household Name: ${householdName} created \n`);
    // TBD: save householdName and uploadedFileName to server
    
    // navigate('/households/ ${householdName}') // reroute to household id??
    
    onClose(); // Close the modal after submission
  }

  return (
    <div>
        <h3 style={{ color: 'black', display: 'block' }}>Please fill out below and click Submit</h3>
        <div className="modal-body">
          {/* Household Name Input */}
          <div className="input-group">
            <button className="label-button">Household Name</button>
            <input
              type="text"
              className="input-field text-white"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="Enter household name"
            />
          </div>

          {/* Submit Button */}
          <div className="input-group">
            <button className="label-button submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
    </div>
  );
};

// export default HouseholdForm;

