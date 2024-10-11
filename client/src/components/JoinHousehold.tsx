import React, { useState } from 'react';
import './CreateHousehold.css'; // Import your modal CSS styles

// Modal component
type ModalProps = {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal2: React.FC<ModalProps> = ({ show, onClose, children }) => { 
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

// Main JoinHousehold component
type JoinHouseholdProps = {
  onClose: () => void; // Function to close the modal
  userId: string;      // Add userId as a prop
};

export const JoinHousehold: React.FC<JoinHouseholdProps> = ({ onClose, userId }) => {
  const [householdName, setHouseholdName] = useState("");
  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  // Function to handle form submission
  //const handleJoin = () => {
  {/*
  async function handleJoin() {
    try {
      console.log(householdName, userId)
      const response = await fetch('http://localhost:6969/household/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, householdName }), // Pass userId and householdName in the request body
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message}`);
      }
  
      const data = await response.json();
      console.log('Household joined successfully:', data);
      alert(`User ${userId} has joined the household: ${data.household.name}`);
    } catch (error) {
      console.error('Error joining household:', (error as Error).message);
      alert(`Failed to join household: ${(error as Error).message}`);
    }
    
    onClose(); // Close the modal after submission
    }
    */}

    async function handleJoin() {
      try {
        // Step 1: Fetch all households from `http://localhost:6969/household`
        const response = await fetch('http://localhost:6969/household', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to retrieve households');
        }
    
        const households = await response.json();
    
        // Step 2: Find the household that matches the given `householdName`
        const matchingHousehold = households.find((household: any) => household.name === householdName);
    
        if (!matchingHousehold) {
          throw new Error(`Household with name "${householdName}" not found`);
        }
    
        console.log("found matching household ID", matchingHousehold._id);
        // Extract the `_id` of the matched household
        const householdId = matchingHousehold._id;
        const trypoop = await fetch('http://localhost:6969/household/poop' , {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({userId,}),

        });
        console.log("PopoPoop");
        // Step 3: Prepare updated members array
        const updatedMembers = [...matchingHousehold.members, userId]; // Add the user to the existing members
    
        // Step 4: Send a PATCH request to update the household's members list using the `householdId`
        const updateResponse = await fetch(`http://localhost:6969/household/updateMembers/${householdId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Send the userId in the request body
        });
    
        console.log("Step 4 completed");

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(`Failed to update household: ${errorData.message}`);
        }
    
        console.log("Step 4 completed");

        const updatedHousehold = await updateResponse.json();
        console.log('Household updated successfully:', updatedHousehold);
        alert(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
      } catch (error) {
        console.error('Error updating household:', error instanceof Error ? error.message : error);
        alert(`Error updating household: ${error instanceof Error ? error.message : error}`);
      }
    }

  return (
    <div>
        <h3 style={{ color: 'black', display: 'block' }}>Please enter a household name to join</h3>
        <div className="modal-body">
          {/* Household Name Input */}
          <div className="input-group">
            <button className="label-button">Household Name</button>
            <input
              type="text"
              className="input-field"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="Enter household name"
            />
          </div>

          {/* Join Button */}
          <div className="input-group">
            <button className="label-button submit-button" onClick={handleJoin}>
              Join
            </button>
          </div>
        </div>
    </div>
  );
};

// export default JoinHousehold;
