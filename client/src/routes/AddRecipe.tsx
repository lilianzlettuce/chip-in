import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import './AddRecipe.css'

type AddRecipeModalProps = {
    onClose: () => void;
    onSave: (itemData: any) => void;
    filteredIngredients: Array<{ _id: string; name: string }>;
};

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSave, filteredIngredients }) => {
    const [items, setItems] = useState<string[]>([]);
    const [addIngredients, setAddIngredients] = useState<string[]>([]);

    const [generatedRecipe, setGeneratedRecipe] = useState<{title: string; ingredients: string; directions: string} | null > (null);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(true);

    const { householdId } = useParams();
    const householdID = householdId;
    const { user } = useUserContext();

    const handleModalClose = () => {
        setShowRecipeModal(false);
        onClose();
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setItems((prevSelected) => [...prevSelected, value]);
        }
        else {
            setItems((prevSelected) => prevSelected.filter(item => item !== value ));
        }
    }; 

    const handleGenerateRecipe = async () => {
        try {
            //const response = await fetch(`http://localhost:4200/generate-recipe`, { 
            const response = await fetch(`http://localhost:6969/recipes/generate-recipe`, {  
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
        }
    }

    

    const handleSubmit =  async () => {
        const requestBody = {
            householdId: householdID, 
            title: generatedRecipe?.title, 
            ingredients: generatedRecipe?.ingredients, 
            directions: generatedRecipe?.directions, 
            owner: user?.id,
        };

        try {
            const response = await fetch(`http://localhost:6969/recipes/save-recipe`, {
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


    return (
        <div>
            {showItemsModal && (
                <div className = "recipe-modal-overlay">
                    <div className="recipeModal">
                    <label>Ingredients:</label>
                    <div className='checkbox-container'>
                        {filteredIngredients.map((item) => (
                            <div key={item._id}>
                            <input
                                type="checkbox"
                                value={item.name}
                                checked={items.includes(item.name)}
                                onChange={handleCheckboxChange}
                            />
                            <label>{item.name}</label>
                            </div>
                        ))}
                    </div>
                    <button className="generate-recipe-button" onClick={handleGenerateRecipe}>Generate!</button>
                    <button className="cancel-recipe-button" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            )}
            

            {showRecipeModal && generatedRecipe && (
                <div className = "recipe-details-modal-overlay">
                    <div className = "recipe-details-modal">
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
                        <div className= "recipe-option-buttons">
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

