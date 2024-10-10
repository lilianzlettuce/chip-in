import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserType, UserContextType } from './types';

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
    const [user, setUser] = useState<UserType | null>(null);
    /*let initialUser: UserType = {
        id: '1',
        username: 'yo mama',
        email: 'lechuga.doe@example.com',
        households: [{ id: 'h1', name: 'Main Household' }],
        preferences: [{ theme: 'dark', notificationsEnabled: true }]
    };*/

    // Get server url
    const PORT = process.env.REACT_APP_PORT || 5050;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

    useEffect(() => {
        console.log("in user context")
        let token = localStorage.getItem("token");
        console.log("token: " + token);
        if (!token) {
            //throw new Error("no token supplied");
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
            //const { isLoggedIn, id, username, email, households, preferences } = data;
            //initialUser = data;
            setUser({
                ...data
            });

            /*setUserId(id);
            setUsername(username);
            setEmail(email);*/

            //data.isLoggedIn ? navigate(`/profile/${data.id}`): null;
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};