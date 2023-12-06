import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onSignUpComplete }) => {
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [errors, setErrors] = useState({});
    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();

    const validateInput = (name, value) => {
        switch (name) {
            case 'username':
                if (value.length < 4 || value.length > 20) {
                    return 'Username must be 4-20 characters long';
                }
                if (!/^[A-Za-z0-9]+$/.test(value)) {
                    return 'Username can only contain letters and numbers';
                }
                return '';
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return 'Invalid email format';
                }
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validateInput(name, value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateInput(key, formData[key]);
            if (error) {
                validationErrors[key] = error;
            }
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:5000/messenger/authentication/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    onSignUpComplete();
                    const data = await response.json();
                    localStorage.setItem('jwtToken', data.token);
                    navigate('/verify-code', { state: { username: formData.username, email: formData.email } });
                } else {
                    const errorData = await response.json();
                    setRegistrationError(errorData.message || 'Failed to register');
                }
            } catch (error) {
                console.error('There was an error!', error);
                setRegistrationError('An error occurred during registration.');
            }
        }
    };

    return (
        <div className="sign-up-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    className="sign-up-input"
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="sign-up-input"
                />
                {registrationError && <p className="error-message">{registrationError}</p>}
                <button type="submit" className="sign-up-button">Submit</button>
            </form>
        </div>
    );
};

export default SignUp;
