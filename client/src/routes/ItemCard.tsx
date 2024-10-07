import React, {useState} from 'react';
import Layout from "../Layout";
import './ItemCard.css';


interface ItemCardProps {
   category: string;
   name: string;
   price: number;
   sharedBy: string[];
   addedBy: string;
   expiryDate: string;
   onDelete: () => void;
};


const ItemCard: React.FC<ItemCardProps> = ({
   category,
   name,
   price,
   sharedBy,
   addedBy,
   expiryDate,
   onDelete
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
       <button className="action-button" onClick={onDelete}>Delete</button>
       </div>
   </div>
   );
};


const Dashboard: React.FC = () => {
    const [showItemCard, setShowItemCard] = useState(true);
    const handleDelete = () => {
        setShowItemCard(false);
    }
    
    const ItemCardProps = {
        category: "Fruit",
        name: "Banana",
        price: 100,
        sharedBy: ["dog", "ur mom", "richard"],
        addedBy: "Chelsea",
        expiryDate: "12/5",
        onDelete: handleDelete
     };
     
    return (
    <div>
        { /*<ItemCard {...ItemCardProps} /> */}
        {showItemCard && <ItemCard {...ItemCardProps} />}
        {showItemCard && <ItemCard {...ItemCardProps} />}
    </div>
    );
};


export default Dashboard