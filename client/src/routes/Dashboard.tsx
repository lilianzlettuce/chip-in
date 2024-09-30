import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('placeholder');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setItems(data);
                setOriginalItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    // Sort by Expiration Date
    const sortByExpirationDate = () => {
        const sortedItems = [...items].sort((a, b) => {
            const dateA = a['expirationDate'] ? new Date(a['expirationDate']).getTime() : Infinity;
            const dateB = b['expirationDate'] ? new Date(b['expirationDate']).getTime() : Infinity;
            return dateA - dateB;
        });
        setItems(sortedItems);
    };

    // Clear Filters
    const clearFilters = () => {
        setItems(originalItems);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Sort and Clear Filters Buttons */}
            <div className="dashboard-controls">
                <button className="dashboard-button" onClick={sortByExpirationDate}>
                    Sort By Expiration Date
                </button>
                <button className="dashboard-button" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            {/* Display the List of Items */}
            <ul className="dashboard-item-list">
                {items.map(item => (
                    <li key={item['_id']} className="dashboard-item">
                        <span className="item-name">{item['name']}</span>
                        <span className="item-expiration">
                            Expiration Date: {item['expirationDate'] ? new Date(item['expirationDate']).toLocaleDateString() : 'N/A'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}