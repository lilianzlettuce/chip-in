import { useUserContext } from '../UserContext';
import React, {useState, useEffect} from 'react';
import CallItemCard from "./ItemCard";
import './ItemCard.css';

export default function Dashboard() {
    const { user } = useUserContext();

    return (
        <div>
            <h1>This is the Dashboard.</h1>
            <h1>user id: {user?.id}</h1>
            <h1>username: {user?.username}</h1>
            <h1>email: {user?.email}</h1>
            <h1>households: </h1>
            <React.StrictMode>
                <CallItemCard />
            </React.StrictMode>
        </div>
    );
}