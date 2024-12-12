import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';

import './JoinHousehold.css';

import { useUserContext } from '../UserContext';


// Modal component
type ModalProps = {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal2: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="join-modal-overlay">
      <div className="join-modal-content">
        <button className="join-close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faX} className="text-black text-lg" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement

  );
};

// Main JoinHousehold component
type JoinHouseholdProps = {
  onClose: () => void; // Function to close the modal
  userId: string | undefined;      // Add userId as a prop
};

interface Notification {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export const JoinHousehold: React.FC<JoinHouseholdProps> = ({ userId }) => {
  const [householdID, setHouseholdID] = useState("");
  const [notification, setNotification] = useState<Notification>({ message: '', type: 'success', show: false });

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
          // alert(`Error: ${householdID} does not exist, please choose a different Household ID`);
          setNotification({ message: `Household with ID: ${householdID} does not exist, please enter a different ID`, type: 'error', show: true });
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
        // alert(`Failed to update household: ${errorData.message}`)
        setNotification({ message: `Failed to update household: ${errorData.message}`, type: 'error', show: true });
        throw new Error(`Failed to update household: ${errorData.message}`);
      }


      const updatedHousehold = await updateResponse.json();
      console.log('Household updated successfully:', updatedHousehold);
      updateUser();
      setNotification({ message: `User has been added to the household: ${updatedHousehold.name}`, type: 'success', show: true });
    } catch (error) {
      console.error('Error updating household:', error instanceof Error ? error.message : error);
    }
  }

  return (
    <div className="join-modal-content">
      <img
        src="https://i.postimg.cc/yxBj94kZ/join-house.png"
        alt="Join Household Logo"
        className="join-household-image"
      />
      <h3 className="join-message">
        Please enter join code
      </h3>
      <div className="join-modal-body">
        {/* Household ID Input */}
        <div className="join-input-group">
          <input
            type="text"
            className="join-input-field"
            value={householdID}
            onChange={(e) => setHouseholdID(e.target.value)}
            placeholder="Code"
          />
        </div>
  
        {/* Join Button */}
        <div className="join-input-group">
          <button className="join-label-button join-submit-button" onClick={handleJoin}>
            Join
          </button>
        </div>
  
        {/* Notification Message */}
        {notification.show && (
          <div className={`join-notification-card ${notification.type}`}>
            <p>{notification.message}</p>
          </div>
        )}
      </div>
    </div>
  );
  
  
};