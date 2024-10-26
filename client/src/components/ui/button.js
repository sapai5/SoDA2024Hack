import React from 'react';

const Button = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 ${className} border rounded-full`}
        >
            {children}
        </button>
    );
};

export default Button;
