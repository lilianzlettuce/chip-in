import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedRoommate, setSelectedRoommate] = useState<string>('');
    const [categories, setCategories] = useState(['Food', 'Cleaning', 'Pet']); // Sample categories
    const [roommates, setRoommates] = useState([]); 
    const [sortAscending, setSortAscending] = useState(true);
    //const { householdId } = useParams();
    const householdId = '66f8ef8de4baffd9b5f41762';

    useEffect(() => {
        fetchItemsAndRoommates();
    }, []);

    const fetchItemsAndRoommates = async () => {
        try {
            // Fetch items using the new backend route
            const response = await fetch(`http://localhost:6969/filter/sortby/${householdId}`);
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

    // Handle Category Selection
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    // Handle Roommate Selection
    const handleRoommateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoommate(event.target.value);
    };

    // Apply filters based on the selected criteria
    const filterItems = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedCategory) queryParams.append('category', selectedCategory);
            if (selectedRoommate) queryParams.append('sharedBetween', selectedRoommate);

            const response = await fetch(`http://localhost:6969/filter/filterby/${householdId}?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const filteredData = await response.json();
            setItems(filteredData);
        } catch (error) {
            console.error('Error filtering items:', error);
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedRoommate('');
        setItems(originalItems);
    };

    // Sorting function for inventory items based on expiration date
    const sortByExpirationDate = async () => {
        try {
            const sortParam = sortAscending ? 'expirationDate' : 'purchaseDate';
            const response = await fetch(`http://localhost:6969/filter/sortby/${householdId}?sortby=${sortParam}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sortedData = await response.json();
            setItems(sortedData);
            setSortAscending(!sortAscending);
        } catch (error) {
            console.error('Error sorting items:', error);
        }
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