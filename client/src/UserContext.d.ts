import React, { ReactNode } from 'react';
import { UserContextType } from './types';
export declare const useUserContext: () => UserContextType;
interface UserProviderProps {
    children: ReactNode;
}
export declare const UserProvider: React.FC<UserProviderProps>;
export {};
