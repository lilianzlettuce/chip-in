import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserType, UserContextType, HouseholdNavType } from './types';

// Create the context with an initial value of `null` for the user.
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook for using the UserContext.
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<String>();
    const [user, setUser] = useState<UserType | null>(null);

    // Get server url
    const PORT = process.env.REACT_APP_PORT || 5050;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

    // Get user data
    const updateUser = async () => {
        if (userId) {
            // Fetch user profile details based on the user ID
            const userResponse = await fetch(`${SERVER_URL}/user/${userId}`);

            try {
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log("in context update user")
                    console.log(userData);

                    if (userData.households) {
                        setUser((prevUser) => ({
                            ...prevUser,
                            ...userData,
                            id: userId // _id to id
                        }));
                    }
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        }
    }

    // Get user data upon render
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) {
            console.log("no token supplied");
            return;
        }

        // Redirect to profile if user is signed in
        fetch(`${SERVER_URL}/auth/getUserData`, {
            headers: {
                "x-access-token": token,
            },
        })
        .then(res => res.json())
        .then(data => {
            /*setUser({
                ...data
            });*/
            setUserId(data.id);
            console.log("data.id: " + data.id)
        })
        .catch(err => console.error("Error fetching userId:", err));
    }, []);

    // Update user when userId changes
    useEffect(() => {
        if (userId) {
            updateUser(); // Call updateUser only when userId is available
        }
    }, [userId]); // This will trigger when userId changes

    // Get households from user's household ids
    const [ households, setHouseholds ] = useState<HouseholdNavType[]>([]);

    const fetchHouseholds = async () => {
        // If user exists, go through its households
        if (user) {
            const newHouseholds: HouseholdNavType[] = [];

            // Reset households 
            for (let i = 0; i < user.households.length; i++) {
                // Fetch household name from id
                try {
                    const householdRes = await fetch(`${SERVER_URL}/household/${user?.households[i]}`);
                    if (householdRes.ok) {
                        const householdData = await householdRes.json();
            
                        // Create new household nav object
                        let household: HouseholdNavType = {
                            id: user?.households[i],
                            name: householdData.name
                        };

                        // Collect household to add later to avoid multiple state updates in the loop
                        newHouseholds.push(household);
                    } else {
                        console.error("failed to fetch households");
                    }
                } catch(err) {
                    console.error("error fetching households: ", err);
                }
            }

            // Update state once after all households are fetched
            setHouseholds(newHouseholds);
        }
    };

    // Fetch households upon change to user object
    useEffect(() => {
        console.log("all households:")
        console.log(user?.households)
        fetchHouseholds();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, households, setHouseholds }}>
            {children}
        </UserContext.Provider>
    );
};