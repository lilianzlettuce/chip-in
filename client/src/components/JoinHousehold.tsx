import React, { useState } from 'react';
import './CreateHousehold.css'; 

import { useUserContext } from '../UserContext';

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
  userId: string | undefined;      // Add userId as a prop
};

export const JoinHousehold: React.FC<JoinHouseholdProps> = ({ onClose, userId }) => {
  const [householdID, setHouseholdID] = useState("");

  const { updateUser } = useUserContext();

  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  console.log("joinhousehold householdID: ", householdID)

  // Function to handle form submission
  
    async function handleJoin() {
      // Step 1: Get all households from `http://localhost:6969/household` to check if household ID exists
      
      try {
        const response = await fetch(`${SERVER_URL}/household`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
            
        if (response.ok) {
          const households = await response.json();
          console.log("All hoseholds", households)

          const householdexists = households.find((household: { _id: string }) => household._id === householdID);
          if (!householdexists) {
            console.log('error, ${householdID} does not exist');
            alert(`Error: ${householdID} does not exist, please choose a different Household ID`);
            return;
          }
          else (
            console.log("household ID exists")
          )
        } else {
          console.error("Failed to fetch household");
        }
      } catch (err) {
        console.error('error fetching household:', err);
      }
     
      
      //  const matchingHousehold = households.find((household: any) => household.name === householdName);
    
      //  if (!matchingHousehold) {
      //    throw new Error(`Household with name "${householdName}" not found`);
      //  }
    
      //  console.log("found matching household ID", matchingHousehold._id);
        // Extract the `_id` of the matched household
      //  const householdId = matchingHousehold._id;
        
        // Step 3: Prepare updated members array
      //  const updatedMembers = [...matchingHousehold.members, userId]; // Add the user to the existing members
    
        // Step 4: Send a PATCH request to update the household's members list using the `householdId`
      try { 
        const updateResponse = await fetch(`http://localhost:6969/household/addUser/${householdID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Send the userId in the request body
        });
    
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          alert(`Failed to update household: ${errorData.message}`)
          throw new Error(`Failed to update household: ${errorData.message}`);
        }
    

        const updatedHousehold = await updateResponse.json();
        console.log('Household updated successfully:', updatedHousehold);
        updateUser();
        alert(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
      } catch (error) {
        console.error('Error updating household:', error instanceof Error ? error.message : error);
       // alert(`Error updating household: ${error instanceof Error ? error.message : error}`);
      }
    }

  return (
    <div>
        <h3 style={{ color: 'black', display: 'block' }}>Please enter a household ID to join</h3>
        <div className="modal-body">
          {/* Household Name Input */}
          <div className="input-group">
            <button className="label-button">Household ID</button>
            <input
              type="text"
              className="input-field"
              value={householdID}
              onChange={(e) => setHouseholdID(e.target.value)}
              placeholder="Enter household ID"
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

