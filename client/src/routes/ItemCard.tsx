import React from 'react';
import Layout from "../Layout";
import './ItemCard.css';


interface ItemCardProps {
    category: string;
    name: string;
    price: number;
    sharedBy: string[];
    addedBy: string;
    expiryDate: string;
};

const ItemCard: React.FC<ItemCardProps> = ({ 
    category, 
    name, 
    price, 
    sharedBy, 
    addedBy, 
    expiryDate 
}) => {
return (
    <div className="card-container">
        {/* Category Badge */}
        <div className="category-badge">{category}</div>

        {/* Item name and price */}
        <div className="item-info">
        <h3>{name}</h3>
        <span className="price">${price}</span>
        </div>

        {/* Shared by section */}
        <p className="shared-by-text">
        Shared by {sharedBy.join(', ')}
        </p>

        {/* Added by and expiration */}
        <div className="footer">
        <p>Added by {addedBy}</p>
        <span className="expiry">Expires {expiryDate}</span>
        </div>

        {/* Action buttons (Edit, Delete) */}
        <div className="actions">
        <button className="action-button">Edit</button>
        <button className="action-button">Delete</button>
        </div>
    </div>
    );
};

const ItemCardProps = {
    category: "Fruit",
    name: "Banana",
    price: 100,
    sharedBy: ["dog", "ur mom", "richard"],
    addedBy: "Chelsea",
    expiryDate: "12/5",
};

/*const ItemCards: React.FC = () => {
return (
    <div>
        <ItemCard {...ItemCardProps} />
    </div>
);
};

export default ItemCards
*/