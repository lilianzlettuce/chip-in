import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';
import Alerts from '../components/Alerts';
import {InviteHousehold , Modal2}  from './InviteHousehold'

import { UserType, ItemType } from '../types';

export default function Home() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  // Get the state passed from context
  const { user, updateUser } = useUserContext();
  const userId = user?.id;

  // Household info variables
  const [ householdName, updateHouseholdName ] = useState("");
  const [ householdMembers, updateHouseholdMembers ] = useState<UserType[]>([]);
  const [ purchaseHistory, updatePurchaseHistory ] = useState<ItemType[]>([]);
  const [ totalExpenses, updateTotalExpenses ] = useState(0);
  const [ householdAge, updateHouseholdAge ] = useState(100);

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

  const getHouseholdInfo = async () => {
    // Get household name
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        updateHouseholdName(data.name);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Get household members
    try {
      const url = `http://localhost:6969/household/members/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        updateHouseholdMembers(data);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

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

      if (response.ok) {
        // alert(`User ${userId} left household successfully`)
        updateUser();
        navigate('/profile');
      } else {
        alert(`Failed to leave household`)
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const getPurchaseHistory = async () => {
    // Get household name
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/purchaseHistory`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        // Parse purchaseDate into Date objects
        const parsedData = data.map((item: ItemType) => ({
          ...item,
          purchaseDate: new Date(item.purchaseDate),
        }));
        updatePurchaseHistory(parsedData);
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  useEffect(() => {
    getHouseholdInfo();
    getPurchaseHistory();
  }, [householdId]);

  // Update when purchase history fetched
  useEffect(() => {
    updateTotalExpenses(purchaseHistory.reduce((sum, item) => sum + (item.cost || 0), 0));
    if (purchaseHistory[0]) {
      const creationDate = purchaseHistory[0].purchaseDate;
      const currentDate = new Date(); // Current date

      // Calculate the difference in time (milliseconds)
      const differenceInMilliseconds = currentDate.getTime() - creationDate.getTime();

      // Convert the difference to days
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      updateHouseholdAge(differenceInDays);
    }
  }, [purchaseHistory]);

  return (
    <div>
      <Alerts />
      <h1 className="text-xl font-bold">{householdName}</h1>
      <h1>Aggregate data:</h1>
      <div>
        <div>
          Total number of items purchased: {purchaseHistory.length}
        </div>
        <div>
          Total amount spent: ${totalExpenses}
        </div>
        <div>
          Since {purchaseHistory[0]?.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
        </div>
        <div>
          Over the course of: {householdAge} days
        </div>
      </div>
      <h1>Members:</h1>
      <div>
        {householdMembers.map((member, i) => (
          <div key={i}>
            <div>{member.username} | {member.email}</div>
          </div>
        ))}
      </div>
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