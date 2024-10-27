/*import React, { useState } from 'react';
import './CreateHousehold.css'; 
import './Profile.css';

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

  // Success modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  console.log("joinhousehold householdID: ", householdID)

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  };

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
        setIsSuccessOpen(true);
        setSuccessMessage(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
        
        alert(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
      } catch (error) {
        console.error('Error updating household:', error instanceof Error ? error.message : error);
       // alert(`Error updating household: ${error instanceof Error ? error.message : error}`);
      }
    }
*/

/*import React, { useState } from 'react';
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
  userId: string | undefined; // Add userId as a prop
};

export const JoinHousehold: React.FC<JoinHouseholdProps> = ({ onClose, userId }) => {
  const [householdID, setHouseholdID] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { updateUser } = useUserContext();

  // Success modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  console.log('joinhousehold householdID: ', householdID);

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
    setShowJoinModal(false);
    onClose();
  };

  // Function to handle form submission
  async function handleJoin() {
    try {
      // Step 1: Get all households from the server to check if household ID exists
      const response = await fetch(`${SERVER_URL}/household`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const households = await response.json();
        console.log('All households', households);

        const householdexists = households.find((household: { _id: string }) => household._id === householdID);
        if (!householdexists) {
          setShowJoinModal(false);
          setIsSuccessOpen(true);
          setSuccessMessage(`Error: ${householdID} does not exist, please choose a different Household ID`);
          
          //alert(`Error: ${householdID} does not exist, please choose a different Household ID`);
          return;
        } else {
          console.log('household ID exists');
        }
      } else {
        console.error('Failed to fetch household');
      }
    } catch (err) {
      console.error('Error fetching household:', err);
      return;
    }

    // Step 2: Add the user to the household
    try {
      const updateResponse = await fetch(`${SERVER_URL}/household/addUser/${householdID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Send the userId in the request body
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        alert(`Failed to update household: ${errorData.message}`);
        throw new Error(`Failed to update household: ${errorData.message}`);
      }

      const updatedHousehold = await updateResponse.json();
      console.log('Household updated successfully:', updatedHousehold);
      updateUser();
      setIsSuccessOpen(true);
      setSuccessMessage(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
      setShowJoinModal(false);

    } catch (error) {
      console.error('Error updating household:', error instanceof Error ? error.message : error);
      alert(`Error updating household: ${error instanceof Error ? error.message : error}`);
    }
  }

  return (
    <div>
      <h3 style={{ color: 'black', display: 'block' }}>Please enter a household ID to join</h3>
      <div className="modal-body">
 
        <div className="input-group">

          <input
            type="text"
            className="input-field"
            value={householdID}
            onChange={(e) => setHouseholdID(e.target.value)}
            placeholder="Enter household ID"
          />
        </div>


        <div className="input-group">
          <button className="label-button submit-button" onClick={handleJoin}>
            Join
          </button>
        </div>


        {isSuccessOpen && (
          <Modal2 show={isSuccessOpen} onClose={closeSuccess}>
            <p>{successMessage}</p>
            <button className="close-button2" onClick={closeSuccess}>Close</button>
          </Modal2>
        )}
      </div>
    </div>
  );
};
*/

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
  onClose: () => void;
  userId: string | undefined;
};

export const JoinHousehold: React.FC<JoinHouseholdProps> = ({ onClose, userId }) => {
  const [householdID, setHouseholdID] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(true); // Controls the visibility of the main content
  const { updateUser } = useUserContext();

  // Success/Error modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
    setShowJoinModal(true); // Re-show the main content if needed
    onClose();
  };

  async function handleJoin() {
    try {
      const response = await fetch(`${SERVER_URL}/household`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const households = await response.json();

        const householdExists = households.find((household: { _id: string }) => household._id === householdID);
        if (!householdExists) {
          setShowJoinModal(false); // Hide main content
          setIsSuccessOpen(true);
          setSuccessMessage(`Error: ${householdID} does not exist, please choose a different Household ID`);
          return;
        }
      } else {
        console.error('Failed to fetch household');
      }
    } catch (err) {
      console.error('Error fetching household:', err);
      return;
    }

    try {
      const updateResponse = await fetch(`${SERVER_URL}/household/addUser/${householdID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (updateResponse.ok) {
        const updatedHousehold = await updateResponse.json();
        updateUser();
        setIsSuccessOpen(true);
        setSuccessMessage(`User ${userId} has been added to the household: ${updatedHousehold.name}`);
        setShowJoinModal(false); // Hide main content
      } else {
        const errorData = await updateResponse.json();
        alert(`Failed to update household: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating household:', error instanceof Error ? error.message : error);
      alert(`Error updating household: ${error instanceof Error ? error.message : error}`);
    }
  }

  return (
    <div>
      {showJoinModal && (
        <div>
          <h3 style={{ color: 'black', display: 'block' }}>Please enter a household ID to join</h3>
          <div className="modal-body">
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                value={householdID}
                onChange={(e) => setHouseholdID(e.target.value)}
                placeholder="Enter household ID"
              />
            </div>
            <div className="input-group">
              <button className="label-button submit-button" onClick={handleJoin}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error modal popup */}
      {isSuccessOpen && (
        <Modal2 show={isSuccessOpen} onClose={closeSuccess}>
          <p>{successMessage}</p>
          <button className="close-button2" onClick={closeSuccess}>Close</button>
        </Modal2>
      )}
    </div>
  );
};




