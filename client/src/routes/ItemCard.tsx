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
      {/* Category*/}
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

const ItemCards: React.FC = () => {
    // State to hold the items
    const [items, setItems] = useState([
      {
        id: 1,
        category: "Fruit",
        name: "Banana",
        price: 100,
        sharedBy: ["dog", "ur mom", "richard"],
        addedBy: "Chelsea",
        expiryDate: "12/5"
      },
      {
        id: 2,
        category: "Snacks",
        name: "Goldfish",
        price: 50,
        sharedBy: ["cat", "ur mom", "snickers"],
        addedBy: "Richard",
        expiryDate: "12/12"
      }
    ]);
  
    const handleDelete = (id: number) => {
      // Remove the item by id
      setItems(items.filter(item => item.id !== id));
    }
  
    return (
      <div>
        {items.map(item => (
          <ItemCard
            key={item.id} // Provide a unique key for each item card
            category={item.category}
            name={item.name}
            price={item.price}
            sharedBy={item.sharedBy}
            addedBy={item.addedBy}
            expiryDate={item.expiryDate}
            onDelete={() => handleDelete(item.id)} // Pass the specific id to delete
          />
        ))}
      </div>
    );
  };

/*const Dashboard: React.FC = () => {
   const [showItemCard, setShowItemCard] = useState(true);
   const handleDelete = () => {
       setShowItemCard(false);
   }
   
   const ItemCardProps1 = {
       category: "Fruit",
       name: "Banana",
       price: 100,
       sharedBy: ["dog", "ur mom", "richard"],
       addedBy: "Chelsea",
       expiryDate: "12/5",
       onDelete: handleDelete
    };
    const ItemCardProps2 = {
        category: "Snacks",
        name: "Goldfish",
        price: 50,
        sharedBy: ["cat", "ur mom", "snickers"],
        addedBy: "Richard",
        expiryDate: "12/12",
        onDelete: handleDelete
     };
   
   return (
   <div>
       {showItemCard && <ItemCard {...ItemCardProps1} />}

       {showItemCard && <ItemCard {...ItemCardProps2} />}
   </div>
   );
};
*/



// export default ItemCard