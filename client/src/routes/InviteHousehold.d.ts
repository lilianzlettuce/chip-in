import React from 'react';
import './InviteHousehold.css';
type ModalProps = {
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};
export declare const Modal2: React.FC<ModalProps>;
type InviteHouseholdProps = {
    onClose: () => void;
    householdId: string | undefined;
};
export declare const InviteHousehold: React.FC<InviteHouseholdProps>;
export {};
