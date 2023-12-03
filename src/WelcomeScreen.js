import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
    return (
        <div className="welcome-screen">
            <h1>Welcome to Our Messenger App</h1>
            <Link to="/signin"><button>Sign In</button></Link>
            <Link to="/signup"><button>Sign Up</button></Link>
        </div>
    );
};

export default WelcomeScreen;
