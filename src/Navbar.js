import React from 'react';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <h1>Chat App</h1>
            <button onClick={onLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
