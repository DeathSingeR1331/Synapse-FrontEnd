// src/pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Voice & Video', desc: 'Enhanced Communication Experience', color: 'bg-purple-700' },
    { title: 'Task Automation', desc: 'Streamline Workflow', color: 'bg-teal-700' },
    { title: 'Sentiment Analysis', desc: 'Gain Valuable Insights from User Responses', color: 'bg-pink-700' },
    { title: 'Conversational Flow', desc: 'Engage in Natural Conversations', color: 'bg-blue-700' },
    { title: 'Interactive Dashboard', desc: 'Empower Decision-Making with Real-Time Insights', color: 'bg-cyan-700' },
    { title: 'AI Knowledge Base', desc: 'Personalized Information Delivery', color: 'bg-indigo-700' },
  ];

  const handleLogin = () => {
    toast.info("Redirecting to Dashboard...");
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const handleSignup = () => {
    toast.success("Proceeding to Signup...");
    setTimeout(() => navigate('/signup'), 1000);
  };

  return (
    <motion.div
      className="relative w-full h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/synapse-bg.png')",
        backgroundColor: "#1f2937"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Top right login/signup */}
        <div className="flex justify-end w-full max-w-6xl mb-6">
          <div className="flex gap-4">
            <button onClick={handleSignup} className="bg-blue-600 px-4 py-2 rounded">Sign Up</button>
            <button onClick={handleLogin} className="bg-transparent border border-white px-4 py-2 rounded">Login</button>
          </div>
        </div>

        {/* Logo & Title Block (restored) */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-2">🧠</div>
          <h1 className="text-4xl font-bold mb-2">SYNAPSE AI</h1>
          <p className="text-gray-300">The intelligent and personalized solutions for the future</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.color} p-4 rounded-lg`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Welcome;
