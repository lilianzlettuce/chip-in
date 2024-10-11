import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import Profile from './Profile';

// Function to handle the "Leave Household" action

export default function Home() {
    const {householdId} = useParams();
    const navigate = useNavigate();

      // Get the state passed from NavLink (householdName and userId)
      const {user} = useUserContext();
      const userId = user?.id;

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
            <button className="label-button submit-button" onClick={handleLeave}>
              Leave Household
            </button>
          </div>
        </div>
    );
}