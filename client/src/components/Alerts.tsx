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
  const userPrefs = user?.preferences;

  const [allAlerts, setAllAlerts] = useState<AlertType[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState<AlertType[]>([]);
  const [readAlerts, setReadAlerts] = useState<AlertType[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  const fetchAlerts = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/alert/${householdId}/${userId}`;

      // Fetch all household alerts relevant to user
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userAlerts = await response.json();

      // Separate alerts into unread and read lists
      let newUnreadAlerts: AlertType[] = [];
      let newReadAlerts: AlertType[] = [];
      for (const alert of userAlerts) {
        // Check if alert has been read by this user
        let isRead: boolean = false;
        if (alert.readBy && alert.readBy.length > 0) {
          for (const tempUserId of alert.readBy) {
            if (tempUserId == userId) {
              // Add to read list
              newReadAlerts.push(alert);
              isRead = true;
              break;
            }
          }
        }

        // If user not found in alert readBy list, add it to unread list
        if (!isRead) {
          newUnreadAlerts.push(alert);
        }
      }

      // Update alerts in state
      setAllAlerts(userAlerts);
      setUnreadAlerts(newUnreadAlerts);
      setReadAlerts(newReadAlerts);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  useEffect(() => {
    if (user && householdId) {
      fetchAlerts();
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
      <button className="relative bg-gray-900 text-white w-10 h-10 rounded-full" 
          onClick={() => {
            fetchAlerts();
            setShowAlerts(showAlerts ? false : true);
          }}
      >
        {unreadAlerts.length != 0 &&
          <span className="absolute top-[0px] left-[-8px] flex">
            <span className="relative text-sm rounded-full h-5 w-5 bg-red-500">
              {unreadAlerts.length}
            </span>
          </span>
        }
        <FontAwesomeIcon icon={faBell} className="fa-regular text-lg" />
      </button>
      {showAlerts &&
        <div className="bg-gray-900 text-white w-72 max-h-[calc(100vh-100px)] overflow-y-scroll rounded-md shadow-auth-card">
          {(unreadAlerts.length == 0 && readAlerts.length == 0) &&
            <div className="p-6">No Alertications</div>
          }
          {unreadAlerts.map((alert, i) => (
            <div className="flex flex-col gap-2 items-start p-4 py-3 border-solid border-gray-300 border-b-2"
                key={i}>
              <div className={`text-sm font-bold ${alert.category == "Payment" ? "text-teal-400" : alert.category == "Nudge" ? "text-amber-400" : "text-red-400"}`}>
                — {alert.category} —
              </div>
              <div className="text-start">
                {alert.content}
              </div>
              <div className="text-sm">
                {alert.date}
              </div>
            </div>
          ))}
          {readAlerts.map((alert, i) => (
            <div className="bg-gray-600 text-gray-200 flex flex-col gap-2 items-start p-4 py-3 border-solid border-gray-300 border-b-2"
                key={i}>
              <div className={`text-sm font-bold ${alert.category == "Payment" ? "text-teal-400" : alert.category == "Nudge" ? "text-amber-400" : "text-red-400"}`}>
                — {alert.category} —
              </div>
              <div className="text-start">
                {alert.content}
              </div>
              <div className="text-sm">
                {alert.date}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}