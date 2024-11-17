export type HouseholdType = {
    [x: string]: any;
    id: string;
    name: string;
};

export type HouseholdNavType = {
    id: string;
    name: string;
};

export type AlertType = {
    _id: string;
    date: Date;
    category: "Payment" | "Nudge" | "Expiration";
    content: string;
    recipients: string[];
    readBy: string[];
}

export type ItemType = {
    _id: string;
    archived: boolean;
    cost: number;
    expirationDate: Date;
    name: string;
    purchaseDate: Date;
    purchasedBy: {
        _id: string;
        username: string;
    };
    sharedBetween: {
        _id: string;
        username: string;
    }[];
}
  
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
    preferences:  {
        expirationNotif: "all" | "relevant" | "none",
        paymentNotif:  "all" | "relevant" | "none",
    },
    //preferences:  boolean[],
}