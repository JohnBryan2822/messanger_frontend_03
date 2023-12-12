// CreatePasswordPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import if you need to navigate after submission
import './CreatePassword.css';

const CreatePasswordPage = ({setPasswordReady, setUser}) => {
    const location = useLocation(); // Use the useLocation hook
    const { username } = location.state || {};
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use this if you need to redirect after setting the password

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmitPassword = async () => {
        try {
            const response = await fetch(`http://localhost:5000/messenger/authentication/register/setPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, code: password }), // Sending the password as an object
                credentials: 'include'
            });

            if (response.ok) {
                // Set Password Complete 'true'
                setPasswordReady(true);
                
                const user = await response.json(); // Assuming the response is the user object
                setUser(user);
                // Handle successful password set, e.g., navigate to a login page or a success page
                navigate('/homepage'); // Update this to your desired route
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to set password');
            }
        } catch (error) {
            console.error('Error setting password:', error);
        }
    };

    return (
        <div className="create-password-container">
            <form className="create-password-form">
                <h2>Create Your Password</h2>
                <input 
                    type="password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    placeholder="Enter your password" 
                />
                <button onClick={handleSubmitPassword}>Submit</button>
            </form>
        </div>
    );
};

export default CreatePasswordPage;
