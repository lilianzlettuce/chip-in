import React from 'react';
import './ItemCard.css';

interface ItemCardProps {
  category: string;
  name: string;
  price: number;
  sharedBy: string[];
  addedBy: string;
  expiryDate: string;
  isExpiringSoon: boolean;
  onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  category,
  name,
  price,
  sharedBy,
  addedBy,
  expiryDate,
  isExpiringSoon,
  onDelete
}) => {
  return (
    <div className={`card-container ${isExpiringSoon ? 'expiring-soon' : ''}`}>
      <div className="category-badge">{category}</div>
      <div className="item-info">
        <h3>{name}</h3>
        <span className="price">${price.toFixed(2)}</span>
      </div>
      <p className="shared-by-text">Shared by {sharedBy.join(', ')}</p>
      <div className="footer">
        <p>Added by {addedBy}</p>
        <span className="expiry">Expires {expiryDate}</span>
      </div>
      <div className="actions">
        <button className="action-button">Edit</button>
        <button className="action-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ItemCard;