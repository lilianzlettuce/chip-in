import React from 'react';
import './UtilityCard.css';

interface UtilityCardProps {
    name: string;
    status: string;
    icon: string;
}

const UtilityCard: React.FC<UtilityCardProps> = ({ name, status, icon }) => {
    return (
        <div className="utility-card">
            <div className="utility-icon">{icon}</div>
            <div className="utility-name">{name}</div>
            <div className="utility-status">{status}</div>
        </div>
    );
};

const Utility: React.FC = () => {
    return (
        <div className="utility-container">
            <UtilityCard
                name="Water"
                status="Running"
                icon="💧"
            />
            <UtilityCard
                name="Electricity"
                status="Active"
                icon="⚡"
            />
            <UtilityCard
                name="WiFi"
                status="Connected"
                icon="📶"
            />
        </div>
    );
};

export default UtilityCard;