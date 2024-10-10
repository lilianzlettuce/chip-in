import React, {useState, useEffect} from 'react';
import Layout from "../Layout";
import CallItemCard from "./ItemCard";
import './ItemCard.css';

export default function Dashboard() {
    return (
        <div>
            <React.StrictMode>
                <CallItemCard />
            </React.StrictMode>
        </div>
    );
}