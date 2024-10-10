export type HouseholdType = {
    id: string;
    name: string;
};
  
export type PreferencesType = {
    theme: string;
    notificationsEnabled: boolean;
};

export type UserContextType = {
    user: UserType | null;
    //setUser: (newSession: UserType) => void;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export type UserType = {
    id: string,
    username: string,
    email: string,
    households: HouseholdType[],
    preferences:  PreferencesType[],
}