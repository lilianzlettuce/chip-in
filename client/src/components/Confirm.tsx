import React, { useEffect } from 'react';
import './CreateHousehold.css'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

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
                    <FontAwesomeIcon icon={faXmark} className="text-black text-md" />
                </button>
                <h2 className="text-md">{message}</h2>
                <div className="w-full flex justify-between gap-2">
                    <button className="w-1/2 min-w-fit bg-green-400 text-white font-semibold p-3 my-4 rounded" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="w-1/2 min-w-fit bg-red-400 text-white font-semibold p-3 my-4 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};