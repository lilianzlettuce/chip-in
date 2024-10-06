import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedRoommate, setSelectedRoommate] = useState<string>('');
    const [categories, setCategories] = useState(['Groceries', 'Cleaning', 'Pet']); // Sample categories
    const [roommates, setRoommates] = useState([]); 
    const [sortAscending, setSortAscending] = useState(true);

    useEffect(() => {
        // Fetch items and roommates from API
        const fetchItemsAndRoommates = async () => {
            try {
                const response = await fetch('http://localhost:6969/item/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setItems(data);
                setOriginalItems(data);

                // Fetch roommates (users) from your API
                const roommatesResponse = await fetch('http://localhost:6969/user/');
                if (!roommatesResponse.ok) {
                    throw new Error(`HTTP error! status: ${roommatesResponse.status}`);
                }
                const roommatesData = await roommatesResponse.json();
                setRoommates(roommatesData);  // Assumes the data contains an array of users
            } catch (error) {
                console.error('Error fetching items and roommates:', error);
            }
        };

        fetchItemsAndRoommates();
    }, []);

    // Handle Category Selection
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    // Handle Roommate Selection
    const handleRoommateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoommate(event.target.value);
    };

    // Filter items based on selected categories and roommates
    const filterItems = () => {
        const filteredItems = originalItems.filter(item => {
            const matchesCategory = selectedCategory === '' || item['category'] === selectedCategory;
            
            const matchesRoommate = selectedRoommate === '' || (item['sharedBetween'] as string[] || []).includes(selectedRoommate);
    
            return matchesCategory && matchesRoommate;
        });
        setItems(filteredItems);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedRoommate('');
        setItems(originalItems);
    };

    // Sorting function for inventory items based on expiration date
    const sortByExpirationDate = () => {
        const sortedItems = [...inventoryItems].sort((a, b) => {
            const dateA = a['expirationDate'] ? new Date(a['expirationDate']).getTime() : Infinity;
            const dateB = b['expirationDate'] ? new Date(b['expirationDate']).getTime() : Infinity;

            return sortAscending ? dateA - dateB : dateB - dateA;
        });
        setItems([...sortedItems, ...groceryItems]);
        setSortAscending(!sortAscending);  // Toggle the sort direction
    };

    // Separate items into Inventory and Grocery List
    const inventoryItems = items.filter(item => item['purchaseDate'] && !item['archived']);  // Purchased and in stock
    const groceryItems = items.filter(item => !item['purchaseDate'] && !item['archived']);   // Items that need to be purchased

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Dropdown for filtering by category and roommates */}
            <div className="dashboard-controls">
                <div className="filter-section">
                    <label htmlFor="category-filter">Filter by Category:</label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="filter-dropdown"
                    >
                        <option value="">Select a Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-section">
                    <label htmlFor="roommate-filter">Filter by Roommate:</label>
                    <select
                        id="roommate-filter"
                        value={selectedRoommate}
                        onChange={handleRoommateChange}
                        className="filter-dropdown"
                    >
                        <option value="">Select a Roommate</option>
                        {roommates.map(roommate => (
                            <option key={roommate['_id']} value={roommate['_id']}>
                                {roommate['name']}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="dashboard-button" onClick={filterItems}>
                    Apply Filters
                </button>
                <button className="dashboard-button" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            {/* Sort by Expiration Date Button */}
            <div className="dashboard-controls">
                <button className="dashboard-button" onClick={sortByExpirationDate}>
                    Sort by Expiration Date
                </button>
            </div>

            {/* Inventory Items Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Inventory</h2>
                <ul className="dashboard-item-list">
                    {inventoryItems.length === 0 ? (
                        <li className="dashboard-item">No items in inventory</li>
                    ) : (
                        inventoryItems.map(item => (
                            <li key={item['_id']} className="dashboard-item">
                                <span className="item-name">{item['name']}</span>
                                <span className="item-category">Category: {item['category']}</span>
                                <span className="item-roommates">
                                    Expiration Date: {item['expirationDate'] ? new Date(item['expirationDate']).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="item-roommates">
                                    Shared with: {(item['sharedBetween'] as string[] || []).map((roommateId: any) => {
                                        const roommate = roommates.find(r => r['_id'] === roommateId);
                                        return roommate ? roommate['name'] : 'Unknown';
                                    }).join(', ')}
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
                                <span className="item-category">Category: {item['category']}</span>
                                <span className="item-roommates">
                                    Shared with: {(item['sharedBetween'] as string[] || []).map((roommateId: any) => {
                                        const roommate = roommates.find(r => r['_id'] === roommateId);
                                        return roommate ? roommate['name'] : 'Unknown';
                                    }).join(', ')}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}