import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';

import { AlertType } from '../types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell
} from '@fortawesome/free-regular-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Function to handle the "Leave Household" action

export default function Alerts() {
  const { householdId } = useParams();

  // Get the state passed from NavLink (householdName and userId)
  const { user } = useUserContext();
  const userId = user?.id;

  const [allNotifs, setAllNotifs] = useState<AlertType[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const fetchNotifs = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/alert/${householdId}`;

      // Create the POST request with userId in the body
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("notifs: ");
      console.log(data);
      setAllNotifs(data);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  useEffect(() => {
    if (householdId) {
      fetchNotifs();
    }
  }, [householdId]);

  //const location = useLocation();
  // const {householdName} = location.state || {};
  /*const { householdName, userId } = location.state || {}; // Use default empty object

  const handleSubmit = (householdName: string, userId: string) => {
      // Call handleLeave with householdName and userId
      handleLeave(householdName, userId);
  }*/

  return (
    <div className="fixed left-[calc(100%-300px)] w-[300px] px-6 flex flex-col items-end">
      <button className="bg-gray-900 text-white w-10 h-10 rounded-full" 
          onClick={() => {
            fetchNotifs();
            setShowNotifs(showNotifs ? false : true);
          }}
      >
        <FontAwesomeIcon icon={faBell} className="fa-regular text-lg" />
      </button>
      {showNotifs &&
        <div className="bg-white w-64 rounded-md shadow-auth-card">
          {allNotifs.length == 0 &&
            <div className="p-6">No Notifications</div>
          }
          {allNotifs.map((notif, i) => (
            <div className="flex flex-col gap-2 items-start p-4 py-3 border-solid border-gray-300 border-b-2"
                key={i}>
              <div className="text-start">
                {notif.content}
              </div>
              <div className="text-sm">
                {notif.date}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}