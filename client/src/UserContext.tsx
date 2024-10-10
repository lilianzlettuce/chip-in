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

    // Get server url
    const PORT = process.env.REACT_APP_PORT || 5050;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

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
            setUser({
                ...data
            });
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};