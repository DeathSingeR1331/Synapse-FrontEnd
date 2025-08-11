// src/pages/Welcome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { 
      title: 'Context Retention', 
      desc: 'Remembers our entire conversation history for seamless interactions', 
      icon: '🧠',
      gradient: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-400/30'
    },
    { 
      title: 'Voice Interface', 
      desc: 'Natural speech recognition and synthesis for hands-free operation', 
      icon: '🎤',
      gradient: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-400/30'
    },
    { 
      title: 'Task Automation', 
      desc: 'Proactive assistance with scheduling, reminders, and workflows', 
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-400/30'
    },
    { 
      title: 'Smart Analytics', 
      desc: 'Learns your patterns and preferences for personalized insights', 
      icon: '📊',
      gradient: 'from-green-500 to-teal-500',
      borderColor: 'border-green-400/30'
    },
    { 
      title: 'Multi-Platform Sync', 
      desc: 'Seamless experience across web, mobile, and desktop devices', 
      icon: '🔄',
      gradient: 'from-indigo-500 to-purple-500',
      borderColor: 'border-indigo-400/30'
    },
    { 
      title: 'Privacy First', 
      desc: 'Your data stays secure with end-to-end encryption', 
      icon: '🛡️',
      gradient: 'from-red-500 to-pink-500',
      borderColor: 'border-red-400/30'
    },
  ];

  const handleLogin = () => {
    toast.info("Initializing SYNAPSE AI...", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "bg-gray-800 text-white",
    });
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleSignup = () => {
    toast.success("Activating new AI assistant profile...", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "bg-gray-800 text-white",
    });
    setTimeout(() => navigate('/signup'), 1500);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Tech Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}>
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header HUD */}
      <motion.div 
        className="relative z-20 flex justify-between items-center p-6 border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(0, 255, 255, 0.3)",
                "0 0 40px rgba(0, 255, 255, 0.6)",
                "0 0 20px rgba(0, 255, 255, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
              🧠
            </div>
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              SYNAPSE AI
            </h1>
            <p className="text-xs text-cyan-300/60">Personal AI Assistant v2.1</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-cyan-400 text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-cyan-300/60 text-xs">
              System Online
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={handleLogin}
              className="px-6 py-2.5 border border-cyan-400/30 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 font-medium text-cyan-300 hover:text-cyan-200"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Access System
            </motion.button>
            <motion.button 
              onClick={handleSignup}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Initialize AI
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 pt-0">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20 max-w-5xl mx-auto mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div 
            className="relative mb-8"
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="text-8xl md:text-9xl mb-4 filter drop-shadow-lg">🧠</div>
            <motion.div 
              className="absolute inset-0 text-8xl md:text-9xl mb-4 text-cyan-400/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧠
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            SYNAPSE AI
          </motion.h1>
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <p className="text-2xl md:text-3xl text-cyan-200 mb-4 font-light">
              Your Personal AI Assistant
            </p>
            <p className="text-lg text-cyan-300/70 max-w-3xl mx-auto leading-relaxed">
              Advanced context retention • Natural conversation • Seamless integration across all your devices
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.button 
              onClick={handleSignup}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl relative overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 40px rgba(0, 200, 255, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Activate SYNAPSE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </motion.button>
            
            <motion.button 
              onClick={handleLogin}
              className="px-10 py-4 border-2 border-cyan-400/30 rounded-lg text-lg font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 text-cyan-200 hover:text-cyan-100"
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgba(0, 255, 255, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="w-full max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              AI Capabilities
            </h2>
            <p className="text-cyan-300/60 text-xl">
              Advanced features designed for seamless personal assistance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative group p-8 rounded-2xl bg-gray-900/40 backdrop-blur-sm border ${feature.borderColor} hover:border-opacity-60 transition-all duration-500 overflow-hidden`}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.9 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-all duration-500`}></div>
                
                {/* Tech lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-100 group-hover:text-cyan-50 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          className="mt-20 p-6 bg-gray-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl max-w-4xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-2xl font-bold text-cyan-200 mb-2">
                Ready to Meet Your AI Assistant?
              </h3>
              <p className="text-cyan-300/70">
                Join thousands of users already enhancing their productivity with SYNAPSE AI
              </p>
            </div>
            <motion.button 
              onClick={handleSignup}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Initialize Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer HUD */}
      <motion.footer 
        className="relative z-10 border-t border-cyan-500/20 bg-black/40 backdrop-blur-sm py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyan-300/60 mb-4 md:mb-0">
            © 2024 SYNAPSE AI • Advanced Personal Assistant Technology
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              All Systems Operational
            </span>
            <span className="text-cyan-300/60">|</span>
            <span className="text-cyan-300/60">99.9% Uptime</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Welcome;