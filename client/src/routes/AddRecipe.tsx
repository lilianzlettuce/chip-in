import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import './AddRecipe.css'

type AddRecipeModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    filteredIngredients: Array<{ _id: string; name: string }>;
};

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSave, filteredIngredients }) => {
    //const [items, setItems] = useState<string[]>([]);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [newItems, setNewItems] = useState<string[]>([]);
    const [addIngredients, setAddIngredients] = useState('');

    const [generatedRecipe, setGeneratedRecipe] = useState<{ title: string; ingredients: string; directions: string } | null>(null);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(true);

    const [loading, setLoading] = useState(false);

    const { householdId } = useParams();
    const householdID = householdId;
    const { user } = useUserContext();

    const [tooltipMessage, setTooltipMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    // Get env vars
    const PORT = process.env.REACT_APP_PORT || 6969;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;


    const handleModalClose = () => {
        setShowRecipeModal(false);
        onClose();
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setCheckedItems((prevSelected) => [...prevSelected, value]);
        }
        else {
            setCheckedItems((prevSelected) => prevSelected.filter(item => item !== value));
        }
    };

    const handleGenerateRecipe = async () => {
        setLoading(true);
        // const tempItems = [...checkedItems, ...newItems];
        let tempItems = "";
        for (let i = 0; i < checkedItems.length; i++) {
            tempItems += checkedItems[i] + ', ';
        }
        for (let i = 0; i < newItems.length; i++) {
            tempItems += newItems[i] + ', ';
        }
        if (tempItems.endsWith(', ')) {
            tempItems = tempItems.slice(0, -2); 
        }
        const items = [tempItems]
        //console.log(items);
        try {
            const response = await fetch(`${SERVER_URL}/recipes/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate recipe');
            }

            const data = await response.json();
            console.log('Generated Recipe:', data);

            setGeneratedRecipe(data);
            setShowRecipeModal(true);
            setShowItemsModal(false);

        } catch (error) {
            console.error('Error generating recipe:', error);
        } finally {
            setLoading(false);
        }
    }
       

    const handleSubmit = async () => {
        const requestBody = {
            householdId: householdID,
            title: generatedRecipe?.title,
            ingredients: generatedRecipe?.ingredients,
            directions: generatedRecipe?.directions,
            owner: user?.id,
        };

        try {
            const response = await fetch(`${SERVER_URL}/recipes/save-recipe`, {
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

            console.log('Recipe added successfully!');
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
        onSave(generatedRecipe);
        onClose();
    }

    // adding additional items
    const handleAddAddtionalItems = () => {
        // checks if new ingredient isnt in items and gets rid of spaces 
        const trimmedIngredient = addIngredients.trim();
        const isInFilteredIngredients = filteredIngredients.some((item) => item.name === trimmedIngredient);
        
        if (trimmedIngredient && !newItems.includes(addIngredients) && !checkedItems.includes(addIngredients) && !isInFilteredIngredients) {
            setNewItems((prevItems) => [...prevItems, addIngredients.trim()]);
            setAddIngredients('');  // clear field for next additional item
        }
        else if (isInFilteredIngredients || newItems.includes(trimmedIngredient) || checkedItems.includes(trimmedIngredient)){            
            setTooltipMessage('Item already in purchased list');
            setShowTooltip(true);

            setTimeout(() => {
                setShowTooltip(false);
            }, 3000);
            
        }
    };

    // deleting additional items
    const handleDeleteAdditionalItems = (ingredient: string) => {
        setNewItems((prevItems) => prevItems.filter(item => item !== ingredient ));
    };


    return (
        <div>
            {showItemsModal && (
                <div className="recipe-modal-overlay">
                    <div className="recipeModal">
                        {/* Items from checklist */}
                        <label>Available Ingredients:</label>
                        <div className='checkbox-container'>
                            {filteredIngredients.map((item) => (
                                <div key={item._id}>
                                    <input
                                        type="checkbox"
                                        value={item.name}
                                        checked={checkedItems.includes(item.name)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label>{item.name}</label>
                                </div>
                            ))}
                        </div>
                        <label>Add More Ingredients:</label>
                        <div className="fill-container">
                            <div className="input-add-container">
                                <input
                                    className="text-white"
                                    type="text"
                                    placeholder="Ingredient"
                                    value={addIngredients}
                                    onChange={(e) => setAddIngredients(e.target.value)}
                                />
                                <div className="additem-button-container">
                                    <button className="add-item-button" onClick={handleAddAddtionalItems}>Add</button>
                                    {showTooltip && (
                                        <div className="add-tooltip">
                                            {tooltipMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h4>Added Ingredients</h4>
                            <div className="added-ingredients">
                                
                                <div className="tags-container">
                                    {newItems.map((item, index) => (
                                        <div key={index} className="ingredient-tag">
                                            {item}
                                            <button onClick={() => handleDeleteAdditionalItems(item)}>x</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="generate-recipe-button" onClick={handleGenerateRecipe} disabled={loading}
                        >{loading ? 'Generating...' : 'Generate!'}</button>
                        <button className="cancel-recipe-button" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="spinner-overlay">
                    <img
                        className="image"
                        src="https://i.postimg.cc/kMwkrtbv/chipinlogo.png"
                        alt="Loading"
                    />
                </div>
            )}


            {showRecipeModal && generatedRecipe && (
                <div className="recipe-details-modal-overlay">
                    <div className="recipe-details-modal">
                        <h2>{generatedRecipe.title}</h2>
                        <section>
                            <h3>Ingredients</h3>
                            <ul>{generatedRecipe.ingredients.split('\n')
                                .filter(line => line.trim() !== ' ')
                                .map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}</ul>
                        </section>
                        <section>
                            <h3>Directions</h3>
                            <ul>{generatedRecipe.directions.split('\n')
                                .filter(line => line.trim() !== ' ')
                                .map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}</ul>
                        </section>
                        <div className="recipe-option-buttons">
                            {/*<button className="save-recipe-button" onClick={() => generatedRecipe && handleSubmit}>Save!</button>*/}
                            <button className="save-recipe-button" onClick={handleSubmit}>Save!</button>
                            {/*<button className="no-recipe-button" onClick={() => setShowRecipeModal(false)}>Not for me</button>*/}
                            <button className="no-recipe-button" onClick={handleModalClose}>Not for me</button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
};

export default AddRecipeModal;