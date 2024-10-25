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
  const [showAlerts, setShowAlerts] = useState(false);

  // Colors associated with each alert category
  const alertColors = {
    "Nudge": "amber",
    "Expiration": "red",
    "Payment": "green"
  };
  console.log(alertColors["Nudge"])

  const fetchAlerts = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/alert/${householdId}`;

      // Fetch all household alerts
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter alerts through user preferences
      let userAlerts: AlertType[] = [];
      for (const alert of data) {
        // Check user's preference for this type of notification
        let preference: string = "all";
        if (alert.category == "Payment" && userPrefs?.paymentNotif) {
          preference = userPrefs?.paymentNotif;
          console.log("in payment: " + preference)
        } else if (alert.category == "Expiration" && userPrefs?.paymentNotif) {
          preference = userPrefs?.expirationNotif;
        }

        if (preference == "all") {
          // Add alert
          userAlerts.push(alert);
        } else if (preference == "relevant") {
          // Add alert if relevant
        }
      }

      console.log(data)

      // Update alerts in state
      setAllAlerts(userAlerts);
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
      <button className="bg-gray-900 text-white w-10 h-10 rounded-full" 
          onClick={() => {
            fetchAlerts();
            setShowAlerts(showAlerts ? false : true);
          }}
      >
        <FontAwesomeIcon icon={faBell} className="fa-regular text-lg" />
      </button>
      {showAlerts &&
        <div className="bg-gray-900 text-white w-72 rounded-md shadow-auth-card">
          {allAlerts.length == 0 &&
            <div className="p-6">No Alertications</div>
          }
          {allAlerts.map((alert, i) => (
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
              <div className="text-sm">
                {alert.recipients}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}