import React from 'react';
import './CreateHousehold.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
type ConfirmProps = {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    children?: React.ReactNode;
};
export declare const Confirm: React.FC<ConfirmProps>;
export {};
