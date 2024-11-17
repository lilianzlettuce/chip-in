import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeCard.css';

interface Recipe {
    tags?: string[];
    title: string;
    owner?: string;
    email?: string;
    ingredients: string;
    directions: string;
    _id?: string;
}

interface RecipeCardProps {
    recipe: Recipe;
    onDelete: (id: string) => void;
}

function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
    const { householdId } = useParams();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDelete = async () => {
        if (!recipe._id) return;

        try {
            const response = await fetch(`http://localhost:6969/recipes/${householdId}/${recipe._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete(recipe._id);
            } else {
                console.error('Failed to delete the recipe');
            }
        } catch (error) {
            console.error('Error deleting the recipe:', error);
        }
    };

    const ingredientsArray = recipe.ingredients
        ? recipe.ingredients.split('\n').map(ingredient => ingredient.trim()).filter(ingredient => ingredient)
        : [];

    const directionsArray = recipe.directions
        ? recipe.directions.split('\n').map(step => step.trim()).filter(step => step)
        : [];


    return (
        <div className="recipe-card">
            <div className="tags">
                {(recipe.tags || []).map((tag, index) => (
                    <span className="tag" key={index}>{tag}</span>
                ))}
            </div>
            <div className="recipe-card-header">
                <h3 className="recipe-card-title">{recipe.title || 'Untitled'}</h3>
                <div className="recipe-actions">
                    <button onClick={handleDelete}>🗑️</button>
                </div>
            </div>
            <p className="added-by">Added by {recipe.owner}</p>
            <p className="ingredients-count">
                {ingredientsArray.length} ingredients
            </p>
            {isExpanded && (
                <>
                    {ingredientsArray.length > 0 && (
                        <div className="ingredients">
                            <h4>Ingredients:</h4>
                            <ul>
                                {ingredientsArray.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {directionsArray.length > 0 && (
                        <div className="directions">
                            <h4>Directions:</h4>
                            <ol>
                                {directionsArray.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </>
            )}
            <button className="expand-collapse-btn" onClick={toggleExpand}>
                {isExpanded ? '▲' : '▼'}
            </button>
        </div>
    );
}

export default RecipeCard;