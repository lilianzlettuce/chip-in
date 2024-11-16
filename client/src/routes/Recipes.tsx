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
    const [selectedUser, setSelectedUser] = useState<string>(''); // filtering by creator

    useEffect(() => {
        if (!householdId) {
            setError('Household ID is not available');
            setLoading(false);
            return;
        }

        console.log("Fetching data for householdId:", householdId);

        const fetchData = async () => {
            try {
                // Fetch recipes
                const recipeResponse = await fetch(`http://localhost:6969/recipes/${householdId}`);
                if (!recipeResponse.ok) throw new Error('Network response was not ok');
                const recipeData = await recipeResponse.json();

                // Fetch usernames for each recipe
                if (recipeData && Array.isArray(recipeData)) {
                    const updatedRecipes = await Promise.all(
                        recipeData.map(async (recipe: Recipe) => {
                            try {
                                const userResponse = await fetch(`http://localhost:6969/user/${recipe.owner}`);
                                if (userResponse.ok) {
                                    const userData = await userResponse.json();
                                    recipe.owner = userData.username;
                                } else {
                                    recipe.owner = 'Unknown';
                                }
                            } catch {
                                recipe.owner = 'Unknown';
                            }
                            return recipe;
                        })
                    );
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
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }

                setLoading(false);
            }

        };

        fetchData();
    }, [householdId]);

    const handleDeleteRecipe = (id: string) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    };

    const getFilteredPurchasedItems = async () => {
        if (!householdId) return;

        console.log("USER ", user?.id);

        try {
            const response = await fetch(`http://localhost:6969/household/${householdId}/purchasedlist`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Purchased Items Data:', data);

            const filteredData = data.filter((item: PurchasedItem) => {
                return item.category === "Food" &&
                    item.sharedBetween.some(sharedWith => sharedWith.username === user?.username);
            });

            console.log('Filtered Items Data:', filteredData);
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

    const filteredRecipes = selectedUser
        ? recipes.filter(recipe => recipe.owner === selectedUser)
        : recipes;

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
                        placeholder="Search items..."
                        className="search-bar"
                    />
                    <button className="clear-button">&times;</button>
                </div>
                <button className="generate-recipe-btn"
                    onClick={() => {
                        setIsRecipeModalOpen(true);
                    }}
                >GENERATE RECIPE 🍽️</button>
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
                        <RecipeCard
                            key={index}
                            recipe={recipe}
                            onDelete={handleDeleteRecipe}
                        />
                    ))
                ) : (
                    <div className="no-recipes-message">No recipes</div>
                )}
            </div>

            {isRecipeModalOpen && (
                <AddRecipeModal onClose={() => setIsRecipeModalOpen(false)}
                    onSave={handleSaveRecipe}
                    filteredIngredients={currIngredients}
                />
            )}
        </div>
    );
}