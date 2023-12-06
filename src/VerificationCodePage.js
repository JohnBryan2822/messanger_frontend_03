import React, { useState, useEffect } from 'react';
import './VerificationPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const VerificationCodePage = ({ onVerificationSuccess }) => {
    const location = useLocation(); // Use the useLocation hook
    const { username, email } = location.state || {}; // Extract username and email from the location state
    const [formData] = useState({ username, email });
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(60);
    const [verificationError, setVerificationError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        setVerificationError(''); // Reset error message when user edits code
    };

    const onConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:5000/messenger/authentication/register/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }) // Assuming the backend expects an object with the verification code
            });

            if (!response.ok) {
                throw new Error('Verification failed');
            }

            setTimeout(() => {
                alert("Verification successful!");
                onVerificationSuccess();
                navigate('/create-password', { state: { username: formData.username } }); // Navigate to password creation page
            }, 1000);
        } catch (error) {
            setVerificationError(error.message || 'An error occurred during verification.');
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch(`http://localhost:5000/messenger/authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setTimer(60); // Reset the timer
                setCode(''); // Clear the verification code input
                setVerificationError(''); // Clear any existing error messages
            } else {
                // Handle errors
                setVerificationError('Failed to resend code. Please try again.');
            }
        } catch (error) {
            console.error('Error resending code:', error);
            setVerificationError('An error occurred during resending the code.');
        }
    };

    return (
        <div className="verification-page">
            <h2>Enter Verification Code</h2>
            <input 
                type="text" 
                className="verification-input" 
                value={code} 
                onChange={handleCodeChange} 
                maxLength={6} 
            />
            <button className="verify-button" onClick={onConfirm}>Confirm</button>
            {verificationError && <p className="error-message">{verificationError}</p>}
            {timer === 0 && (
                <button className="resend-button" onClick={handleResend}>Resend Code</button>
            )}
            {timer > 0 && <p>Time remaining: {timer} seconds</p>}
        </div>
    );
};

export default VerificationCodePage;
