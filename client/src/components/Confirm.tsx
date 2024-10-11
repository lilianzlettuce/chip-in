import React, { useEffect } from 'react';
import './CreateHousehold.css'; 

// import { useNavigate } from 'react-router-dom';
// Confirm component
type ConfirmProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  children?: React.ReactNode;
};


export const Confirm: React.FC<ConfirmProps> = ({ show, onClose, onConfirm, message }) => { 
    // Freeze background
    useEffect(() => {
        if (show) {
          // Prevent background scroll when modal is open
          document.body.classList.add("body-no-scroll");
        } else {
          // Re-enable background scroll when modal is closed
          document.body.classList.remove("body-no-scroll");
        }
        return () => {
          document.body.classList.remove("body-no-scroll");
        };
    }, [show]);
  
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <h2 className="text-md">{message}</h2>
                <div className="flex justify-between">
                    <button className="w-5/12 bg-green-400 text-white font-semibold p-3 my-4 rounded" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="w-5/12 bg-red-400 text-white font-semibold p-3 my-4 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};