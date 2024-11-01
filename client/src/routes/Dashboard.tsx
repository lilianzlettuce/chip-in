import React, { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import { useParams } from 'react-router-dom';

import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import Corkboard from '../components/Corkboard';
import AddItemModal from './AddItem';
import AddItemModalGrocery from './AddGrocery';
import Alerts from '../components/Alerts';
import EditPurchasedItemModal from './EditPurchased'
import EditGroceryItemModal from './EditGrocery'

import './Dashboard.css';
import './AddItem.css';

export default function Dashboard() {
    const { user } = useUserContext();
    const { householdId } = useParams();
    const householdID = householdId;

    const [purchasedItems, setPurchasedItems] = useState([]);
    const [groceryItems, setGroceryItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedRoommates, setSelectedRoommates] = useState<string[]>([]);
    const [categories] = useState(['Food', 'Drink', 'Cleaning', 'Toiletries', 'Pet', 'Other']);
    const [roommates, setRoommates] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [targetList, setTargetList] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);


    // Collapsing feature
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isCollapsed2, setIsCollapsed2] = useState(false)

    // Toggle Expired Items Button
    const [isToggled, setIsToggled] = useState(false)
    const [isExpiredMode, setIsExpiredMode] = useState(true);

    // Edit Items
    const [editPurchasedModalOpen, setEditPurchasedModalOpen] = useState(false);
    const [editGroceryModalOpen, setEditGroceryModalOpen] = useState(false);
    const [purchasedName, setPurchasedName] = useState('');
    const [purchasedCategory, setPurchasedCategory] = useState(['Food', 'Drink', 'Cleaning', 'Toiletries', 'Pet', 'Other']);
    const [editItemId, setEditItemId] = useState('');

    useEffect(() => {
        if (householdID) {
            fetchRoommates();
            fetchPurchasedItems();
            fetchGroceryItems();
        }
    }, [householdID]);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setIsSearching(false);
            fetchPurchasedItems();
            fetchGroceryItems();
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:6969/household/${householdId}/search?name=${encodeURIComponent(value)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const results = await response.json();

            const purchased = results.filter((item: { listType: string; }) => item.listType === 'purchased');
            const grocery = results.filter((item: { listType: string; }) => item.listType === 'grocery');

            setPurchasedItems(purchased);
            setGroceryItems(grocery);
            setIsSearching(purchased.length === 0 || grocery.length == 0);
        } catch (error) {
            console.error('Error searching items:', error);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
        fetchPurchasedItems();
        fetchGroceryItems();
    };

    const isExpiringSoon = (expirationDate: string) => {
        if (!expirationDate) return false;

        const now = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration.getTime() - now.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        return daysDiff <= 5 || daysDiff <= 0;
    };


    const moveItem = async (itemData: any, targetList: string) => {
        setIsLoading(true);
        const endpoint = targetList === 'purchased' ? '/addtopurchased' : '/addtogrocery';
        const householdId = householdID;
        const userId = user?.id;

        const requestBody = {
            householdId,
            name: itemData.name,
            category: itemData.category,
            purchasedBy: userId,
            sharedBetween: itemData.sharedBetween || [],
            purchaseDate: targetList === 'purchased' ? new Date().toISOString() : null,
            expirationDate: targetList === 'purchased' ? itemData.expirationDate : null,
            cost: targetList === 'purchased' ? itemData.cost : 0,
        };

        try {
            // Add the item to the target list (purchased or grocery)
            const response = await fetch(`http://localhost:6969/item${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // If moving to the grocery list, keep the item in purchased list in the backend
            if (targetList === 'grocery') {
                /*
                const deleteResponse = await fetch(`http://localhost:6969/item/purchased/${itemData._id}?householdId=${householdID}`, {
                    method: 'DELETE',
                });

                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    console.error('Error details:', errorData);
                    throw new Error(`HTTP error! status: ${deleteResponse.status}`);
                }

                // Update frontend state to remove item from the purchased list
                setPurchasedItems((prev) => prev.filter((item) => item['_id'] !== itemData._id));
                */
            } else {
                // If moving to the purchased list, delete the item from the grocery list
                const deleteResponse = await fetch(`http://localhost:6969/item/grocery/${itemData._id}?householdId=${householdID}`, {
                    method: 'DELETE',
                });

                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    console.error('Error details:', errorData);
                    throw new Error(`HTTP error! status: ${deleteResponse.status}`);
                }

                // Update frontend state to remove item from the grocery list
                setGroceryItems((prev) => prev.filter((item) => item['_id'] !== itemData._id));
            }

            // Refresh both lists after moving the item
            await fetchPurchasedItems();
            await fetchGroceryItems();
        } catch (error) {
            console.error('Error moving item:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleModalSave = async (updatedItem: any) => {
        setIsLoading(true);

        // Ensure the current user is added to the shared list by default
        const sharedUsers = updatedItem.sharedBetween.includes(user?.id)
            ? updatedItem.sharedBetween
            : [...updatedItem.sharedBetween, user?.id];

        const requestBody = {
            householdId: householdID,
            name: updatedItem.name,
            category: updatedItem.category,
            purchasedBy: user?.id,
            sharedBetween: sharedUsers,
            purchaseDate: new Date().toISOString(),
            expirationDate: updatedItem.expirationDate,
            cost: updatedItem.price,
        };

        try {
            // Add the item to the purchased list
            const response = await fetch(`http://localhost:6969/item/addtopurchased`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the item from the grocery list in the backend
            const deleteResponse = await fetch(`http://localhost:6969/item/grocery/${updatedItem._id}?householdId=${householdID}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json();
                console.error('Error details:', errorData);
                throw new Error(`HTTP error! status: ${deleteResponse.status}`);
            }

            // Update the frontend state to remove the item from the grocery list
            setGroceryItems((prev) => prev.filter((item) => item['_id'] !== updatedItem._id));

            // Refresh the purchased items list
            await fetchPurchasedItems();
        } catch (error) {
            console.error('Error moving item:', error);
        } finally {
            setIsLoading(false);
            setModalOpen(false);
            setSelectedItem(null);
        }
    };


    const handlePurchasedEditModalSave = async (updatedItem: any) => {
        try {
            const response = await fetch(`http://localhost:6969/item/editpurchased/${editItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedItem.name,
                    category: updatedItem.category,
                    cost: updatedItem.cost * 100,
                    householdId: updatedItem.householdId
                    // id: editItemId
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Item edited successfully!');
        } catch (error) {
            console.error('Error editing item:', error);
        }
        await fetchPurchasedItems();
    };

    const handleGroceryEditModalSave = async (updatedItem: any) => {
        try {
            const response = await fetch(`http://localhost:6969/item/editgrocery/${editItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedItem.name,
                    category: updatedItem.category,
                    purchasedBy: updatedItem.purchasedBy,
                    sharedBetween: updatedItem.sharedBetween,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Item edited successfully!');
        } catch (error) {
            console.error('Error editing item:', error);
        }
        await fetchGroceryItems();
    };


    const handleAddItem = async () => {
        /*setIsLoading(true);
   
        // Ensure the current user is added to the shared list by default
        const sharedUsers = updatedItem.sharedBetween.includes(user?.id)
            ? updatedItem.sharedBetween
            : [...updatedItem.sharedBetween, user?.id];
   
        const requestBody = {
            householdId: householdID,
            name: updatedItem.name,
            category: updatedItem.category,
            purchasedBy: user?.id,
            sharedBetween: sharedUsers,
            purchaseDate: new Date().toISOString(),
            expirationDate: updatedItem.expirationDate,
            cost: updatedItem.price,
        };
        console.log(`POO ${name}`);*/

        // Refetch to auto-update list displays
        fetchPurchasedItems();
        fetchGroceryItems();
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
                sharedBetween: item.sharedBetween ?? [],
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
            const normalizedData = data.map((item: any) => ({
                ...item,
                sharedBetween: item.sharedBetween ?? [],
            }));

            setGroceryItems(normalizedData);
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
                name: roommate.username,
            })));
        } catch (error) {
            console.error('Error fetching roommates:', error);
        }
    };


    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedCategories((prev) =>
            checked ? [...prev, value] : prev.filter((category) => category !== value)
        );
    };


    const handleRoommateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedRoommates((prev) =>
            checked ? [...prev, value] : prev.filter((roommateId) => roommateId !== value)
        );
    };


    const filterItems = async () => {
        if (!householdID) return;

        try {
            const queryParams = new URLSearchParams();
            if (selectedCategories.length > 0) {
                selectedCategories.forEach((category) => queryParams.append('category', category));
            }

            // If selectedRoommates has entries, join them into a comma-separated string
            if (selectedRoommates.length > 0) {
                const roommatesString = selectedRoommates.join(',');
                queryParams.append('sharedBetween', roommatesString);
            }

            console.log(queryParams.toString());

            // Fetch purchased items filtered by selected categories and roommates
            const purchasedResponse = await fetch(`http://localhost:6969/filter/filterby/${householdID}?${queryParams.toString()}`);
            if (!purchasedResponse.ok) {
                throw new Error(`HTTP error! status: ${purchasedResponse.status}`);
            }
            const filteredPurchasedData = await purchasedResponse.json();
            setPurchasedItems(filteredPurchasedData);

            // Fetch grocery items without roommates filtering (only filter by categories)
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
        setIsExpiredMode(false);
        setIsToggled(false);
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

    const viewExpiredItems = async () => {
        if (!householdID) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:6969/filter/${householdID}/expired`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setPurchasedItems(data);
        } catch (error) {
            console.error('Error fetching expired items:', error);
        }
    };

    const viewExpiringItems = async () => {
        if (!householdID) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:6969/filter/${householdID}/expiring`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setPurchasedItems(data);
        } catch (error) {
            console.error('Error fetching expiring items:', error);
        }
    };


    const handleToggleClick = () => {
        setIsExpiredMode(!isExpiredMode);
        if (!isExpiredMode) {
            viewExpiringItems();
        } else {
            viewExpiredItems();
        }
        setIsToggled(true);
    }


    const handleDelete = async (id: string, listType: string) => {
        try {
            const response = await fetch(`http://localhost:6969/item/${listType}/${id}?householdId=${householdID}`, {
                method: 'DELETE',
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            if (listType === 'purchased') {
                setPurchasedItems((prevItems) => prevItems.filter((item: any) => item._id !== id));
            } else {
                setGroceryItems((prevItems) => prevItems.filter((item: any) => item._id !== id));
            }


            console.log('Item successfully deleted');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };


    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };


    const toggleCollapse2 = () => {
        setIsCollapsed2(!isCollapsed2);
    };

    return (
        <div className="dashboard-container">
            <Alerts />
            <h1 className="dashboard-title">Dashboard</h1>

            <Corkboard />

            {/* Search Bar */}
            <div className="search-bar-wrapper">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                <button className="clear-button" onClick={clearSearch}>
                    &times;
                </button>
            </div>

            {/* Multiselect for filtering by category and roommates */}
            <div className="dashboard-controls">
                <div className="filter-section">
                    <label>Filter by Category:</label>
                    <div className="filter-categories">
                        {categories.map((category) => (
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
                        {roommates.map((roommate) => (
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
                <button className="dashboard-button" onClick={handleToggleClick}>
                    {isExpiredMode ? "View Expired Items" : "View Expiring Items"}
                </button>
            </div>


            {/* Purchased Items Section */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">
                        Inventory
                        <button onClick={toggleCollapse} className="collapse-icon">
                            {isCollapsed ? '▲' : '▼'}
                        </button>
                    </h2>
                    {/* Add Item Button*/}
                    <button
                        className="add-item-button"
                        onClick={() => setModalOpen2(true)} // Open the modal when clicked
                    >
                        ADD ITEM +
                    </button>
                </div>
                {!isCollapsed && (
                    <ul className="dashboard-item-list">
                        {isSearching && searchTerm && purchasedItems.length === 0 ? (
                            // When searching with no results
                            <>
                                <li className="dashboard-item">No matching items</li>
                            </>
                        ) : !isSearching && isToggled && purchasedItems.length === 0 ? (
                            // Display "No Expired Items" or "No Expiring Items" based on toggle mode
                            <>
                                {isExpiredMode ? (
                                    <li className="dashboard-item">No expired items found</li>
                                ) : (
                                    <li className="dashboard-item">No expired items found</li>
                                )}
                            </>
                        ) : purchasedItems.length === 0 ? (
                            // When there are no items in the list and no active search
                            <>
                                <li className="dashboard-item">No purchased items</li>
                            </>
                        ) : (
                            purchasedItems.map((item: any) => (
                                <li key={item['_id']}>
                                    <ItemCard
                                        id={item['_id']}
                                        category={item['category'] || 'Unknown'}
                                        name={item['name'] || 'Unnamed'}
                                        price={item['cost'] ?? 0}
                                        sharedBy={(item['sharedBetween'] as { _id: string; username: string }[] || []).map(
                                            (user) => user.username || 'Unknown'
                                        )}
                                        splits={(item['splits'] || []).map((split: any) => ({
                                            member: split.member.username || 'Unknown',
                                            split: split.split || 0
                                        }))}
                                        purchasedBy={item['purchasedBy']?.username || 'Unknown'}
                                        expiryDate = {
                                            item['expirationDate']
                                                ? new Date(item['expirationDate']).toLocaleDateString('en-US', { timeZone: 'UTC' })
                                                : 'N/A'
                                        }                                        
                                        isExpiringSoon={
                                            item['expirationDate'] && isExpiringSoon(item['expirationDate'])
                                        }
                                        onDelete={() => handleDelete(item['_id'], 'purchased')}
                                        onMove={() => {
                                            moveItem(
                                                {
                                                    ...item,
                                                    cost: 0, // Clear cost
                                                    expirationDate: '', // Clear expiration date
                                                },
                                                'grocery'
                                            );
                                        }}
                                        onEdit={() => {
                                            //setPurchasedName(item['name']);
                                            //setPurchasedCategory(item['category'])
                                            setSelectedItem(item);
                                            setEditItemId(item['_id']);
                                            setEditPurchasedModalOpen(true);
                                        }}
                                        listType="purchased"
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                )}


                {/* Modal for adding new item */}
                {modalOpen2 && (
                    <AddItemModal
                        onClose={() => setModalOpen2(false)}
                        onSave={handleAddItem}
                        roommates={roommates}
                    />
                )}
            </div>


            {/* Grocery List Section */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">
                        Grocery List
                        <button onClick={toggleCollapse2} className="collapse-icon">
                            {isCollapsed2 ? '▲' : '▼'}
                        </button>
                    </h2>
                    {/* Add Item Button*/}
                    <button
                        className="add-item-button"
                        onClick={() => setModalOpen3(true)} // Open the modal when clicked
                    >
                        ADD ITEM +
                    </button>
                </div>
                {!isCollapsed2 && (
                    <ul className="dashboard-item-list">
                        {groceryItems.length === 0 ? (
                            isSearching && searchTerm ? (
                                // When searching with no results
                                <li className="dashboard-item">No matching items</li>
                            ) : (
                                // When there are no items and no active search
                                <li className="dashboard-item">No items to purchase</li>
                            )
                        ) : (
                            groceryItems.map((item: any) => (
                                <li key={item['_id']}>
                                    <ItemCard
                                        id={item['_id']}
                                        category={item['category']}
                                        name={item['name']}
                                        price={item['cost'] || 0}
                                        sharedBy={(item['sharedBetween'] as { _id: string; username: string }[] || []).map(
                                            (user) => user.username || 'Unknown'
                                        )}
                                        purchasedBy={item['purchasedBy']?.username || 'Unknown'}
                                        expiryDate={
                                            item['expirationDate']
                                                ? new Date(item['expirationDate']).toLocaleDateString()
                                                : 'N/A'
                                        }
                                        isExpiringSoon={false}
                                        onDelete={() => handleDelete(item['_id'], 'grocery')}
                                        onMove={() => {
                                            setSelectedItem(item);
                                            setTargetList('purchased');
                                            setModalOpen(true);
                                        }}
                                        onEdit={() => {
                                            //setPurchasedName(item['name']);
                                            //setPurchasedCategory(item['category'])
                                            setSelectedItem(item);
                                            setEditItemId(item['_id']);
                                            setEditGroceryModalOpen(true);
                                        }}
                                        listType="grocery"
                                        splits={[]}
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                )}
                {/* Modal for adding new item */}
                {modalOpen3 && (
                    <AddItemModalGrocery
                        onClose={() => setModalOpen3(false)}
                        onSave={handleAddItem}
                        roommates={roommates}
                    />
                )}
            </div>

            {/* Modal for entering details when moving from grocery to purchased */}
            {modalOpen && selectedItem && (
                <ItemModal
                    item={selectedItem}
                    listType={targetList}
                    roommates={roommates}
                    currentUserId={user?.id || ''}
                    onClose={() => setModalOpen(false)}
                    onSave={(updatedItem) => {
                        handleModalSave(updatedItem);
                    }}
                />
            )}

            {/* Modal for editing items in purchased list*/}
            {editPurchasedModalOpen && (
                <EditPurchasedItemModal
                    item={selectedItem}
                    //name = {purchasedName}
                    //category = {selectedItem.category}
                    onClose={() => setEditPurchasedModalOpen(false)}
                    onSave={(updatedItem) => {
                        // item={selectedItem} 
                        //console.log(updatedItem.name);
                        //console.log(updatedItem.category);
                        //console.log(editItemId);
                        handlePurchasedEditModalSave(updatedItem);
                    }}
                />
            )}

            {/* Modal for editing items in grocery list */}
            {editGroceryModalOpen && (
                <EditGroceryItemModal
                    item={selectedItem}
                    roommates={roommates}
                    onClose={() => setEditGroceryModalOpen(false)}
                    onSave={(updatedItem) => {
                        // item={selectedItem} 
                        //console.log(updatedItem.name);
                        //console.log(updatedItem.category);
                        //console.log(updatedItem.purchasedBy);
                        //console.log(updatedItem.sharedBetween);
                        //console.log(editItemId);
                        handleGroceryEditModalSave(updatedItem);
                    }}
                />
            )}

        </div>
    );
}