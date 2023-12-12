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
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isPasswordReady, setPasswordReady] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp setIsSignUpCompleted={setIsSignUpCompleted} />} />
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/verify-code" element={isSignUpCompleted ?  <VerificationCodePage setIsVerified={setIsVerified} /> : <Navigate to="/signup" />} />
        <Route path="/create-password" element={isVerified ? <CreatePasswordPage setUser={setUser} setPasswordReady={setPasswordReady} /> : <Navigate to="/signup" />} />
        <Route path="/signin" element={<SignIn setUser={setUser}/>} />
        <Route path="/homepage2" element={<HomePage />} />
        <Route path="/homepage" element={isPasswordReady ? <HomePage2 user={user}/> : <Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;
