import React from 'react';
import './JoinHousehold.css';
type ModalProps = {
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};
export declare const Modal2: React.FC<ModalProps>;
type JoinHouseholdProps = {
    onClose: () => void;
    userId: string | undefined;
};
export declare const JoinHousehold: React.FC<JoinHouseholdProps>;
export {};
