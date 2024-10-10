import React, { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import ItemCard from '../components/ItemCard';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useUserContext();
    const householdID = user?.households[0];

    const [purchasedItems, setPurchasedItems] = useState([]);
    const [groceryItems, setGroceryItems] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedRoommates, setSelectedRoommates] = useState<string[]>([]);
    const [categories, setCategories] = useState(['Food', 'Cleaning', 'Pet']);
    const [roommates, setRoommates] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);

    useEffect(() => {
        if (householdID) {
            fetchRoommates();
            fetchPurchasedItems();
            fetchGroceryItems();
        }
    }, [householdID]);

    const moveItem = async (item: any, targetList: string) => {
        const endpoint = targetList === 'purchased' ? '/addtopurchased' : '/addtogrocery';
        const householdId = user?.households[0];

        try {
            const response = await fetch(`http://localhost:6969/item${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    householdId,
                    name: item.name,
                    category: item.category,
                    purchasedBy: item.purchasedBy,
                    sharedBetween: item.sharedBetween,
                    purchaseDate: new Date(),
                    expirationDate: item.expirationDate,
                    cost: item.price,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the lists after moving the item
            await fetchPurchasedItems();
            await fetchGroceryItems();
        } catch (error) {
            console.error('Error moving item:', error);
        }
    };

    const fetchPurchasedItems = async () => {
        if (!householdID) return;

        try {
            const response = await fetch(`http://localhost:6969/household/${householdID}/purchasedlist`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const normalizedData = data.map((item: any) => ({
                ...item,
                sharedBetween: item.sharedBetween ?? [], // Set to an empty array if missing
            }));
            setPurchasedItems(normalizedData);
        } catch (error) {
            console.error('Error fetching purchased items:', error);
        }
    };

    const fetchGroceryItems = async () => {
        if (!householdID) return;

        try {
            const response = await fetch(`http://localhost:6969/household/${householdID}/grocerylist`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGroceryItems(data);
        } catch (error) {
            console.error('Error fetching grocery items:', error);
        }
    };

    const fetchRoommates = async () => {
        if (!householdID) return;

        try {
            const roommatesResponse = await fetch(`http://localhost:6969/household/members/${householdID}`);
            if (!roommatesResponse.ok) {
                throw new Error(`HTTP error! status: ${roommatesResponse.status}`);
            }
            const roommatesData = await roommatesResponse.json();
            setRoommates(roommatesData.map((roommate: any) => ({
                _id: roommate._id,
                name: roommate.username
            })));
        } catch (error) {
            console.error('Error fetching roommates:', error);
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(category => category !== value)
        );
    };

    const handleRoommateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedRoommates(prev =>
            checked ? [...prev, value] : prev.filter(roommateId => roommateId !== value)
        );
    };

    const filterItems = async () => {
        if (!householdID) return;

        try {
            const queryParams = new URLSearchParams();
            if (selectedCategories.length > 0) {
                selectedCategories.forEach(category => queryParams.append('category', category));
            }
            if (selectedRoommates.length > 0) {
                queryParams.append('sharedBetween', selectedRoommates.join(','));
            }

            const purchasedResponse = await fetch(`http://localhost:6969/filter/filterby/${householdID}?${queryParams.toString()}`);
            if (!purchasedResponse.ok) {
                throw new Error(`HTTP error! status: ${purchasedResponse.status}`);
            }
            const filteredPurchasedData = await purchasedResponse.json();
            setPurchasedItems(filteredPurchasedData);

            const groceryResponse = await fetch(`http://localhost:6969/household/${householdID}/grocerylist`);
            if (!groceryResponse.ok) {
                throw new Error(`HTTP error! status: ${groceryResponse.status}`);
            }
            const filteredGroceryData = await groceryResponse.json();
            const filteredGroceryItems = selectedCategories.length > 0
                ? filteredGroceryData.filter((item: any) => selectedCategories.includes(item.category))
                : filteredGroceryData;
            setGroceryItems(filteredGroceryItems);
        } catch (error) {
            console.error('Error filtering items:', error);
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedRoommates([]);
        fetchPurchasedItems();
        fetchGroceryItems();
    };

    const sortByExpirationDate = async () => {
        if (!householdID) return;

        try {
            const response = await fetch(`http://localhost:6969/household/${householdID}/purchasedlist`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const sortedData = data.sort((a: any, b: any) => {
                const dateA = new Date(a.expirationDate).getTime();
                const dateB = new Date(b.expirationDate).getTime();
                return sortAscending ? dateA - dateB : dateB - dateA;
            });

            setPurchasedItems(sortedData);

            setSortAscending(!sortAscending);
        } catch (error) {
            console.error('Error sorting items:', error);
        }
    };

    const handleDelete = (id: number) => {
        setPurchasedItems(purchasedItems.filter((item: any) => item._id !== id));
    };

    const isExpiringSoon = (expirationDate: string) => {
        if (!expirationDate) return false;
    
        const now = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration.getTime() - now.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
    
        console.log(`Checking expiration for ${expirationDate}: ${daysDiff} days remaining`);
    
        return daysDiff <= 5 && daysDiff <= 0;
    };    

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Multiselect for filtering by category and roommates */}
            <div className="dashboard-controls">
                <div className="filter-section">
                    <label>Filter by Category:</label>
                    <div className="filter-categories">
                        {categories.map(category => (
                            <div key={category} className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    checked={selectedCategories.includes(category)}
                                />
                                <label>{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <label>Filter by Roommate:</label>
                    <div className="filter-roommates">
                        {roommates.map(roommate => (
                            <div key={roommate['_id']} className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    value={roommate['_id']}
                                    onChange={handleRoommateChange}
                                    checked={selectedRoommates.includes(roommate['_id'])}
                                />
                                <label>{roommate['name']}</label>
                            </div>
                        ))}
                    </div>
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

            {/* Purchased Items Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Inventory</h2>
                <ul className="dashboard-item-list">
                    {purchasedItems.length === 0 ? (
                        <li className="dashboard-item">No purchased items</li>
                    ) : (
                        purchasedItems.map((item: any) => (
                            <li key={item['_id']}>
                                <ItemCard
                                    id={item['_id']}
                                    category={item['category'] || 'Unknown'}
                                    name={item['name'] || 'Unnamed'}
                                    price={item['price'] ?? 0}
                                    sharedBy={(item['sharedBetween'] as { _id: string; username: string }[] || []).map(user => user.username || 'Unknown')}
                                    addedBy={item['purchasedBy']?.username || 'Unknown'}
                                    expiryDate={item['expirationDate'] ? new Date(item['expirationDate']).toLocaleDateString() : 'N/A'}
                                    isExpiringSoon={item['expirationDate'] && isExpiringSoon(item['expirationDate'])}
                                    onDelete={() => handleDelete(item['_id'])}
                                    onMove={() => moveItem(item, 'grocery')}
                                    listType="purchased"
                                />
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
                        groceryItems.map((item: any) => (
                            <li key={item['_id']}>
                                <ItemCard
                                    id={item['_id']}
                                    category={item['category']}
                                    name={item['name']}
                                    price={item['price'] || 0}
                                    sharedBy={[]}
                                    addedBy={item['addedBy']}
                                    expiryDate="N/A"
                                    isExpiringSoon={false}
                                    onDelete={() => handleDelete(item['_id'])}
                                    onMove={() => moveItem(item, 'purchased')}
                                    listType="grocery"
                                />
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
