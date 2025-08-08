
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    alert('Simulated Google signup successful!');
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Signup for Synapse AI</h2>
        <p className="mb-6 text-gray-400">Continue with Google</p>
        <button
          onClick={handleGoogleSignup}
          className="bg-green-600 w-full py-2 rounded hover:bg-green-700"
        >
          Signup with Google
        </button>
      </div>
    </motion.div>
  );
};

export default Signup;
