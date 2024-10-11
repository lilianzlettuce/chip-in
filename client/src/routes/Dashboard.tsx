import React from 'react';

import { useUserContext } from '../UserContext';
import CallItemCard from "./ItemCard";
import './ItemCard.css';

export default function Dashboard() {
    const { user } = useUserContext();

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>This is the Dashboard.</h1>
            <h1>user id: {user?.id}</h1>
            <h1>username: {user?.username}</h1>
            <h1>email: {user?.email}</h1>
            <h1>households: {user?.households} </h1>
            <React.StrictMode>
                <CallItemCard />
            </React.StrictMode>
        </div>
    );
}