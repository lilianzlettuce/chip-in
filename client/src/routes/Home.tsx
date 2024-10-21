import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';
import {InviteHousehold , Modal2}  from './InviteHousehold'

// Function to handle the "Leave Household" action

export default function Home() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  // Get the state passed from NavLink (householdName and userId)
  const { user, updateUser } = useUserContext();
  const userId = user?.id;

  // Toggle confirmation modal for account deletion
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const openModal = () => setShowConfirmDelete(true);
  const closeModal = () => setShowConfirmDelete(false);

  // Modal for Invite Household
  const [showInviteHousehold, setInviteHousehold] = useState(false);
  // Function to open the modal
  const openModal2 = () => setInviteHousehold(true);
  // Function to close the modal
  const closeModal2 = () => setInviteHousehold(false);

  const handleLeave = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/household/leave/${householdId}`;

      // Create the POST request with userId in the body
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Pass userId in the request body
      });

      const data = await response.json();

      if (response.ok) {
        alert(`User ${userId} left household successfully`)
        updateUser();
        navigate('/profile');
      } else {
        alert(`Failed to leave household`)
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  //const location = useLocation();
  // const {householdName} = location.state || {};
  /*const { householdName, userId } = location.state || {}; // Use default empty object

  const handleSubmit = (householdName: string, userId: string) => {
      // Call handleLeave with householdName and userId
      handleLeave(householdName, userId);
  }*/

  return (
    <div>
      {/*<h1>household name : {householdName}</h1>*/}
      <h1>household id : {householdId}</h1>
      <h1>user id: {userId}</h1>
      <h1>Press the "Leave Household" button below if you wish</h1>
      <h1>Sorry to see you go!</h1>
      <br></br>
      <br></br>
      <br></br>
      {/* Leave Household */}
      <div className="input-group">
        <button className="label-button submit-button" onClick={openModal}>
          Leave Household
        </button>
        <Confirm
          show={showConfirmDelete}
          onClose={closeModal}
          onConfirm={handleLeave}
          message="Are you sure you want to leave this household?">
        </Confirm>

        <h1>Press the "Invite User" button below if you wish to invite others to join this household</h1>
            <div>
              <button 
                className="label-button submit-button"
                  onClick={openModal2}>
                Invite User
              </button>
              <Modal2 show={showInviteHousehold} onClose={closeModal2}>
                <InviteHousehold onClose={closeModal2} householdId={householdId}/> 
              </Modal2>
              <br></br>
              <br></br>
            </div> 



      </div>
    </div>
  );
}