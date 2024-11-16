import React, { useState, useEffect } from 'react';
import { useUserContext } from '../UserContext';
import { useParams } from 'react-router-dom';
import Alerts from '../components/Alerts';
import RecipeCard from '../components/RecipeCard';
import './Recipes.css';
import AddRecipeModal from './AddRecipe';

interface Recipe {
    tags: string[];
    title: string;
    owner: string;
    email: string;
    ingredients: string;
    directions: string;
    _id?: string;
}

interface User {
    _id: string;
    username: string;
}

interface PurchasedItem {
    category: string;
    sharedBetween: { username: string }[];
}

export default function Recipes() {
    const { user } = useUserContext();
    const { householdId } = useParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [householdUsers, setHouseholdUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [currIngredients, setCurrIngredients] = useState<{ _id: string; name: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!householdId) {
            setError('Household ID is not available');
            setLoading(false);
            return;
        }

        console.log("Fetching data for householdId:", householdId);

        const fetchData = async () => {
            try {
                const recipeResponse = await fetch(`http://localhost:6969/recipes/${householdId}`);
                if (!recipeResponse.ok) throw new Error('Network response was not ok');
                const recipeData = await recipeResponse.json();

                if (recipeData && Array.isArray(recipeData)) {
                    const ownerIds = [...new Set(recipeData.map(recipe => recipe.owner).filter(Boolean))];
                    const userResponses = await Promise.all(
                        ownerIds.map(id => fetch(`http://localhost:6969/user/${id}`).then(res => res.json()))
                    );

                    console.log("User responses:", userResponses);

                    const userIdToUsername = userResponses.reduce((map, user) => {
                        if (user && user._id && user.username) {
                            map[user._id] = user.username;
                        }
                        return map;
                    }, {} as Record<string, string>);

                    console.log("User ID to Username map:", userIdToUsername);

                    const updatedRecipes = recipeData.map(recipe => ({
                        ...recipe,
                        owner: userIdToUsername[recipe.owner] || 'Unknown'
                    }));

                    setRecipes(updatedRecipes);
                } else {
                    throw new Error('Invalid data format received from API');
                }

                const userResponse = await fetch(`http://localhost:6969/household/members/${householdId}`);
                if (!userResponse.ok) throw new Error('Error fetching household users');
                const users = await userResponse.json();
                setHouseholdUsers(users);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setLoading(false);
            }
        };

        fetchData();
    }, [householdId]);

    const handleDeleteRecipe = (id: string) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);

        if (!e.target.value.trim()) {
            fetchAllRecipes();
            return;
        }

        try {
            const response = await fetch(`http://localhost:6969/recipes/search/${householdId}?searchTerm=${encodeURIComponent(e.target.value)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const searchResults = await response.json();
            const ownerIds = [...new Set(searchResults.map((recipe: Recipe) => recipe.owner).filter(Boolean))];
            const userResponses = await Promise.all(
                ownerIds.map(id => fetch(`http://localhost:6969/user/${id}`).then(res => res.json()))
            );
            const userIdToUsername = userResponses.reduce((map, user) => {
                if (user && user._id && user.username) {
                    map[user._id] = user.username;
                }
                return map;
            }, {} as Record<string, string>);

            const updatedSearchResults = searchResults.map((recipe: Recipe) => ({
                ...recipe,
                owner: userIdToUsername[recipe.owner] || 'Unknown'
            }));

            setRecipes(updatedSearchResults);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const fetchAllRecipes = async () => {
        try {
            const recipeResponse = await fetch(`http://localhost:6969/recipes/${householdId}`);
            if (!recipeResponse.ok) throw new Error('Network response was not ok');
            const recipeData = await recipeResponse.json();
            const ownerIds = [...new Set(recipeData.map((recipe: Recipe) => recipe.owner).filter(Boolean))];
            const userResponses = await Promise.all(
                ownerIds.map(id => fetch(`http://localhost:6969/user/${id}`).then(res => res.json()))
            );

            const userIdToUsername = userResponses.reduce((map, user) => {
                if (user && user._id && user.username) {
                    map[user._id] = user.username;
                }
                return map;
            }, {} as Record<string, string>);

            const updatedRecipes = recipeData.map((recipe: Recipe) => ({
                ...recipe,
                owner: userIdToUsername[recipe.owner] || 'Unknown'
            }));

            setRecipes(updatedRecipes);
        } catch (error) {
            console.error('Error fetching all recipes:', error);
        }
    };

    const getFilteredPurchasedItems = async () => {
        if (!householdId) return;

        try {
            const response = await fetch(`http://localhost:6969/household/${householdId}/purchasedlist`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const filteredData = data.filter((item: PurchasedItem) => {
                return item.category === "Food" &&
                    item.sharedBetween.some(sharedWith => sharedWith.username === user?.username);
            });
            setCurrIngredients(filteredData);
        } catch (error) {
            console.error('Error fetching purchased items:', error);
        }
    };

    useEffect(() => {
        getFilteredPurchasedItems();
    }, [user, householdId]);

    const handleSaveRecipe = (newRecipe: { title: string; ingredients: string; directions: string }) => {
        setRecipes(prevRecipes => [...prevRecipes, { ...newRecipe, tags: [], owner: user?.username || 'Unknown', email: user?.email || '' }]);
        setIsRecipeModalOpen(false);
    };

    const filteredRecipes = recipes.filter(recipe => selectedUser ? recipe.owner === selectedUser : true);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="recipes-page">
            <Alerts />
            <h1 className="recipe-title">My Recipes</h1>

            {/* Search Bar and Generate Recipe Button */}
            <div className="search-bar-container">
                <div className="search-bar-wrapper">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="search-bar"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className="clear-button" onClick={() => {
                        setSearchQuery('');
                        fetchAllRecipes();
                    }}>&times;</button>
                </div>
                <button className="generate-recipe-btn" onClick={() => setIsRecipeModalOpen(true)}>
                    GENERATE RECIPE 🍽️
                </button>
            </div>

            <div className="recipes-toolbar">
                <div className="sort-by-dropdown">
                    <label htmlFor="sort">View Recipes By: </label>
                    <select id="sort" onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">All Users ...</option>
                        {householdUsers.map(user => (
                            <option key={user._id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="recipe-cards">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe, index) => (
                        <RecipeCard key={index} recipe={recipe} onDelete={handleDeleteRecipe} />
                    ))
                ) : (
                    <div className="no-recipes-message">No recipes</div>
                )}
            </div>

            {isRecipeModalOpen && (
                <AddRecipeModal onClose={() => setIsRecipeModalOpen(false)} onSave={handleSaveRecipe} filteredIngredients={currIngredients} />
            )}
        </div>
    );
}