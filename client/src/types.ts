export type HouseholdType = {
    [x: string]: any;
    id: string;
    name: string;
};

export type HouseholdNavType = {
    id: string;
    name: string;
};
  
export type PreferencesType = {
    theme: string;
    notificationsEnabled: boolean;
};

export type UserContextType = {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    households: HouseholdNavType[];
    setHouseholds: React.Dispatch<React.SetStateAction<HouseholdNavType[]>>;
    updateUser: () => Promise<void>;
};

export type UserType = {
    id: string,
    username: string,
    email: string,
    households: string[],
    preferences:  boolean[],
}