// src/pages/GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // CORRECTED: Get the 'completeGoogleProfile' function from the context. 'login' is removed.
  const { completeGoogleProfile } = useAuth(); 
  const [error, setError] = useState(null);

  const [completionToken, setCompletionToken] = useState(null);
  const [profileData, setProfileData] = useState({ username: '', date_of_birth: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const accessToken = searchParams.get('access_token');
    const authError = searchParams.get('error');

    if (authError) {
      setError(`Authentication failed: ${authError}`);
      return;
    }
    
    // Handle existing users with access_token
    if (accessToken) {
      // Set the access token and redirect to dashboard
      setAccessToken(accessToken);
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Handle new users with completion token
    if (token) {
      setCompletionToken(token);
    } else {
      // If a user lands here without any token, it's an invalid state.
      setError("Invalid authentication state: No authentication token found.");
    }
  }, [searchParams, navigate]);
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!completionToken) {
        setError("Completion token is missing. Cannot submit profile.");
        return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeGoogleProfile(completionToken, profileData);
      
      if (result.success) {
        // On success, the user is now fully logged in and can be redirected
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-lg mb-4">Authentication Error</p>
        <p className="bg-gray-800 p-4 rounded text-center">{error}</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-blue-600 px-4 py-2 rounded">
          Back to Login
        </button>
      </div>
    );
  }

  if (completionToken) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <form onSubmit={handleProfileSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
              value={profileData.username}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date_of_birth"
              className="w-full p-3 mb-6 rounded bg-gray-700 text-white"
              value={profileData.date_of_birth}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 py-3 rounded text-white hover:bg-green-700 disabled:bg-gray-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Display a generic loading state while the token is being processed.
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Processing authentication...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we complete your login</p>
      </div>
    </div>
  );
};

export default GoogleCallback;