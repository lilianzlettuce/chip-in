import React, { useState } from 'react';
import './InviteHousehold.css'; 

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

// Main InviteHousehold component
type InviteHouseholdProps = {
  onClose: () => void; // Function to close the modal
  householdId: string | undefined;      // Add householdId as a prop
};

export const InviteHousehold: React.FC<InviteHouseholdProps> = ({ onClose, householdId }) => {
  const [EmailAddress, setEmailAddress] = useState("");

  const { updateUser } = useUserContext();
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
            alert(`Error: ${EmailAddress} does not exist, please choose a different user email address`);
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
  
        if (response.ok) {
          alert('Invitation email sent successfully!');
        } else {
          alert('Invitation email sent failed. Please try again.');
        }
      } catch (err) {
        console.error('error sending email', err);
      } 


    }

    return (
        <div>
            <div>
              <h3 style={{ color: 'black', marginBottom: '10px' }}>Household ID : {householdId}</h3>
            </div>
            <div>
              <h3 style={{ color: 'black', marginBottom: '10px' }}>Please enter email address for the invitation</h3>
            </div>
            <div className="modal-body">
              {/* Household Name Input */}
              <div className="input-group">
                {/*<button className="label-button">Household ID : {householdId}</button>*/}
                <input
                  type="text"
                  className="input-field"
                  value={EmailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="email address"
                />
              </div>
            
              {/* Invite Button */}
              <div className="input-group">
                <button className="label-button submit-button" onClick={handleInvite}>
                  Invite
                </button>
              </div>
            </div>
        </div>
      );

    
      
  
  
};

// export default InviteHousehold;

