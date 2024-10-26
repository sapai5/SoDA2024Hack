import React from 'react';

const Badge = ({ children, variant }) => {
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                variant === 'secondary' ? 'bg-gray-200 text-gray-700' : ''
            }`}
        >
            {children}
        </span>
    );
};

export default Badge;
