import React, { useState } from 'react';
import './InviteHousehold.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../UserContext';

  // Get server url
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

// Modal component
type ModalProps = {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal2: React.FC<ModalProps> = ({ show, onClose, children }) => { 
  if (!show) return null;

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal-content">
        <button className="invite-close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faX} className="text-black text-sm" />
        </button>
        {children}
      </div>
    </div>
  );
};


// Main InviteHousehold component
type InviteHouseholdProps = {
  onClose: () => void; // Function to close the modal
  householdId: string | undefined;      // Add householdId as a prop
};

interface Notification {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export const InviteHousehold: React.FC<InviteHouseholdProps> = ({ onClose, householdId }) => {
  const [EmailAddress, setEmailAddress] = useState("");
  const [notification, setNotification] = useState<Notification>({ message: '', type: 'success', show: false });


  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  console.log("Invite household householdId: ", householdId)
  console.log("port: ", PORT)
  console.log("server URL", SERVER_URL)

  // Function to handle email invitation to join Household
  
    async function handleInvite() {
      // Step 1: Fetch all users from `http://localhost:6969/user` to check if the email address exists
      try {
        console.log("display email address", EmailAddress)
        console.log("local port: ", PORT)
        const ChkEmailresponse = await fetch(`http://localhost:6969/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (ChkEmailresponse.ok) {
          const AllUsersData = await ChkEmailresponse.json();
          console.log('All users data', AllUsersData);
  
          const emailexists = AllUsersData.find((user: { email: string }) => user.email === EmailAddress);
          if (!emailexists) {
            console.log('error, ${EmailAddress} does not exist');
            //alert(`Error: ${EmailAddress} does not exist, please choose a different user email address`);
            setNotification({ message: `${EmailAddress} does not exist, please choose a different user email address`, type: 'error', show: true });
            return;
          }
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (err) {
        console.error('error fetching user profile:', err);
      }

      // Step 2: send email invitation
      try {
        const response = await fetch(`http://localhost:6969/user/invitejoin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: EmailAddress,  householdId: householdId}),
        });
        {/*
        if (response.ok) {
          alert('Invitation email sent successfully!');
        } else {
          alert('Invitation email sent failed. Please try again.');
        }
        */}
        if (response.ok) {
          // Set success notification
          setNotification({ message: 'Invitation email sent successfully!', type: 'success', show: true });
        } else {
          // Set error notification
          setNotification({ message: 'Invitation email failed. Please try again.', type: 'error', show: true });
        }

        } catch (err) {
          console.error('error sending email', err);
          setNotification({ message: 'An error occurred. Please try again.', type: 'error', show: true });
        }  
            // Hide the notification after 3 seconds
        //setTimeout(() => {
        //  setNotification((prev) => ({ ...prev, show: false }));
        //}, 3000);

        } 

        const closeNotification = () => {
          setNotification((prev) => ({ ...prev, show: false }));

    }

      
  
    return (
      <div className="invite-modal-body">
        <h3 style={{ color: 'black', display: 'block', fontSize: '16px', fontWeight: 'bold'  }}>Household ID: {householdId}</h3>
        <div className="invite-input-group">
          <label className="label-text">Please enter user's email address to invite!</label>
        </div>
        <div className="invite-input-group">
          <input
            type="text"
            className="invite-input-field"
            value={EmailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Email address"
          />
        </div>
        <div className="invite-input-group">
          <button className="invite-submit-button" onClick={handleInvite}>Invite</button>

           {/* Notification UI */}
          {notification.show && (
            <div className={`invite-notification-card ${notification.type}`}>
              {/*<button className="close-button" onClick={closeNotification}>x</button>*/}
              <p>{notification.message}</p>
            </div>
          )}
        </div>
      </div>
    );
};

// export default InviteHousehold;


