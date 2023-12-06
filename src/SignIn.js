import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = ({setUserId}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{4,20}$/;
        return usernameRegex.test(username) && passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:5000/messenger/authentication/login', { // Replace with your API's URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const user = await response.json(); // Assuming the response is the user object
                    setUserId(user.id);
                    navigate('/homepage'); // Redirect to home or dashboard page
                } else {
                    // Handle errors, e.g., invalid credentials
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Error logging in. Please try again.');
            }
        } else {
            alert('Invalid username or password format');
        }
    };

    return (
        <div className="sign-in-container">
        <form onSubmit={handleSubmit} className="sign-in-form">
            <h1>Sign In</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
            <Link to="/signup">Don't have an account? Sign Up</Link>
        </form>
    </div>
    );
};

export default SignIn;
