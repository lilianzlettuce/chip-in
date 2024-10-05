import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('placeholder'); // Replace with your actual API endpoint
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

    // Separate items into Inventory and Grocery List
    const inventoryItems = items.filter(item => item['purchaseDate'] && !item['archived']);  // Purchased and in stock
    const groceryItems = items.filter(item => !item['purchaseDate'] && !item['archived']);   // Items that need to be purchased

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Sort and Clear Filters Buttons aligned with Inventory */}
            <div className="dashboard-controls-inventory">
                <h2 className="section-title">Inventory</h2>
                <div className="dashboard-controls">
                    <button className="dashboard-button" onClick={sortByExpirationDate}>
                        Sort By Expiration Date
                    </button>
                    <button className="dashboard-button" onClick={clearFilters}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Inventory Items Section */}
            <div className="dashboard-section">
                <ul className="dashboard-item-list">
                    {inventoryItems.length === 0 ? (
                        <li className="dashboard-item">No items in inventory</li>
                    ) : (
                        inventoryItems.map(item => (
                            <li key={item['_id']} className="dashboard-item">
                                <span className="item-name">{item['name']}</span>
                                <span className="item-expiration">
                                    Expiration Date: {item['expirationDate'] ? new Date(item['expirationDate']).toLocaleDateString() : 'N/A'}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Grocery List Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Grocery List</h2>
                <ul className="dashboard-item-list">
                    {groceryItems.length === 0 ? (
                        <li className="dashboard-item">No items to purchase</li>
                    ) : (
                        groceryItems.map(item => (
                            <li key={item['_id']} className="dashboard-item">
                                <span className="item-name">{item['name']}</span>
                                <span className="item-expiration">
                                    Expiration Date: {item['expirationDate'] ? new Date(item['expirationDate']).toLocaleDateString() : 'N/A'}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}