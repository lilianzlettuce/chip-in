import React from 'react';
import './CreateHousehold.css';
type ModalProps = {
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};
export declare const Modal: React.FC<ModalProps>;
type HouseholdFormProps = {
    onClose: () => void;
};
export declare const HouseholdForm: React.FC<HouseholdFormProps>;
export {};
