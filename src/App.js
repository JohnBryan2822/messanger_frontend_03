import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import SignUp from './SignUp';
import VerificationCodePage from './VerificationCodePage'; // Import this new component
import CreatePasswordPage from './CreatePasswordPage'; // Import this new component
import SignIn from './SignIn';
import HomePage from './HomePage';
import HomePage2 from './HomePage2';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [setIsSignUpCompleted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Function to call when user successfully completes the sign-up
  const handleSignUpComplete = () => {
      setIsSignUpCompleted(true);
  };

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp onSignUpComplete={handleSignUpComplete} />} />
        <Route path="/create-password" element={<CreatePasswordPage />} />
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/verify-code" element={<VerificationCodePage onVerificationSuccess={handleVerificationSuccess} />} />
        <Route path="/create-password" element={isVerified ? <CreatePasswordPage /> : <Navigate to="/signup" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/homepage2" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage2 />} />
      </Routes>
    </Router>
  );
};

export default App;
