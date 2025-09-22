// src/pages/Welcome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loadTimer = setTimeout(() => setIsLoaded(true), 500);
    
    // Cycle through features
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
      clearInterval(featureTimer);
    };
  }, []);

  const features = [
    { 
      title: 'Context Retention', 
      desc: 'Advanced memory architecture remembers every conversation detail across sessions', 
      icon: '🧠',
      gradient: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-400/30',
      tech: 'Neural Memory Core'
    },
    { 
      title: 'Voice Interface', 
      desc: 'Ultra-low latency voice processing with natural language understanding', 
      icon: '🎤',
      gradient: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-400/30',
      tech: 'Audio Processing Engine'
    },
    { 
      title: 'Task Automation', 
      desc: 'Intelligent workflow optimization with predictive task management', 
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-400/30',
      tech: 'Automation Protocol'
    },
    { 
      title: 'Smart Analytics', 
      desc: 'Deep learning insights from behavioral patterns and preferences', 
      icon: '📊',
      gradient: 'from-green-500 to-teal-500',
      borderColor: 'border-green-400/30',
      tech: 'Analytics Framework'
    },
    { 
      title: 'Multi-Platform Sync', 
      desc: 'Quantum-encrypted synchronization across unlimited device ecosystem', 
      icon: '🔄',
      gradient: 'from-indigo-500 to-purple-500',
      borderColor: 'border-indigo-400/30',
      tech: 'Sync Protocol'
    },
    { 
      title: 'Privacy First', 
      desc: 'Military-grade encryption with zero-knowledge architecture', 
      icon: '🛡️',
      gradient: 'from-red-500 to-pink-500',
      borderColor: 'border-red-400/30',
      tech: 'Security Layer'
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
      {/* Enhanced Animated Tech Background */}
      <div className="absolute inset-0">
        {/* Layered Grid Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px),
                 linear-gradient(rgba(100,200,255,0.02) 2px, transparent 2px),
                 linear-gradient(90deg, rgba(100,200,255,0.02) 2px, transparent 2px)
               `,
               backgroundSize: '50px 50px, 50px 50px, 200px 200px, 200px 200px'
             }}>
        </div>
        
        {/* Moving Circuit Lines */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 48%, rgba(0,255,255,0.1) 49%, rgba(0,255,255,0.1) 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(0,200,255,0.05) 49%, rgba(0,200,255,0.05) 51%, transparent 52%)
            `,
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Enhanced Animated Orbs */}
        <motion.div 
          className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-8"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.08, 0.15, 0.08],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Enhanced Header HUD */}
      <motion.div 
        className="relative z-20 flex justify-between items-center p-6 border-b border-cyan-500/20 bg-black/60 backdrop-blur-md"
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
            {/* Iconic SYNAPSE Logo */}
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center relative overflow-hidden group">
              <svg 
                className="w-8 h-8 text-white relative z-10" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Neural network nodes */}
                <circle cx="6" cy="8" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0s'}} />
                <circle cx="16" cy="6" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                <circle cx="26" cy="10" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '1s'}} />
                <circle cx="8" cy="16" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '1.5s'}} />
                <circle cx="24" cy="18" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '2s'}} />
                <circle cx="6" cy="24" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.3s'}} />
                <circle cx="16" cy="26" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.8s'}} />
                <circle cx="26" cy="22" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '1.3s'}} />
                
                {/* Neural connections */}
                <motion.path 
                  d="M8.5 8.5L13.5 6.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                />
                <motion.path 
                  d="M18.5 6.5L23.5 9.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.path 
                  d="M6 10.5L8 13.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.path 
                  d="M10.5 16L21.5 18" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
                <motion.path 
                  d="M8 21.5L13.5 24" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
                <motion.path 
                  d="M18.5 26L23.5 22.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.7"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
            <motion.div 
              className="absolute inset-0 bg-cyan-400 rounded-lg opacity-20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SYNAPSE AI
            </h1>
            <p className="text-xs text-cyan-300/60 font-mono">Neural Assistant • Build 2.1.4</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-cyan-400 text-sm font-mono tracking-wider">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-cyan-300/60 text-xs flex items-center">
              <motion.div 
                className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              System Online
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={handleLogin}
              className="px-6 py-2.5 border border-cyan-400/30 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 font-medium text-cyan-300 hover:text-cyan-200 relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Access System</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </motion.button>
            <motion.button 
              onClick={handleSignup}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Initialize AI</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 pt-0">
        {/* Enhanced Hero Section */}
        <motion.div 
          className="text-center mb-20 max-w-6xl mx-auto mt-12"
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
            {/* Main SYNAPSE Logo - Larger Version */}
            <motion.div 
              className="text-8xl md:text-9xl mb-4 filter drop-shadow-lg relative flex items-center justify-center"
              animate={isLoaded ? {
                filter: [
                  "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))",
                  "drop-shadow(0 0 40px rgba(0, 255, 255, 0.8))",
                  "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg 
                className="w-32 h-32 md:w-40 md:h-40 text-cyan-400" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Central core */}
                <motion.circle 
                  cx="16" 
                  cy="16" 
                  r="3" 
                  fill="currentColor"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Neural network nodes */}
                <motion.circle 
                  cx="6" cy="8" r="2" fill="currentColor" 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                />
                <motion.circle 
                  cx="16" cy="4" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle 
                  cx="26" cy="8" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                />
                <motion.circle 
                  cx="28" cy="16" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
                />
                <motion.circle 
                  cx="26" cy="24" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                />
                <motion.circle 
                  cx="16" cy="28" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
                <motion.circle 
                  cx="6" cy="24" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
                />
                <motion.circle 
                  cx="4" cy="16" r="2" fill="currentColor"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2.1 }}
                />
                
                {/* Animated neural connections */}
                <motion.path 
                  d="M8 8L13 13" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0 }}
                />
                <motion.path 
                  d="M16 6L16 13" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />
                <motion.path 
                  d="M24 8L19 13" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <motion.path 
                  d="M26 16L19 16" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                />
                <motion.path 
                  d="M24 24L19 19" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />
                <motion.path 
                  d="M16 26L16 19" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
                />
                <motion.path 
                  d="M8 24L13 19" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                />
                <motion.path 
                  d="M6 16L13 16" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  opacity="0.6"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 3.5 }}
                />
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.span
              animate={isLoaded ? {
                textShadow: [
                  "0 0 30px rgba(0, 255, 255, 0.3)",
                  "0 0 60px rgba(0, 255, 255, 0.5)",
                  "0 0 30px rgba(0, 255, 255, 0.3)"
                ]
              } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            >
              SYNAPSE AI
            </motion.span>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-lg blur-xl"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.h1>
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <p className="text-2xl md:text-3xl text-cyan-200 mb-4 font-light tracking-wide">
              Advanced Personal AI Assistant
            </p>
            <p className="text-lg text-cyan-300/70 max-w-4xl mx-auto leading-relaxed">
              Cutting-edge context retention • Seamless natural conversation • Enterprise-grade security • Multi-dimensional learning capabilities
            </p>
            
            {/* Technical Specs Bar with Live Data */}
            <motion.div
              className="mt-8 p-6 bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="flex justify-center space-x-8 text-sm mb-4">
                <div className="text-center">
                  <div className="text-cyan-400 font-mono font-bold text-lg">99.97%</div>
                  <div className="text-cyan-300/60">Uptime</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div 
                      className="bg-green-400 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "99%" }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-mono font-bold text-lg">&lt;50ms</div>
                  <div className="text-cyan-300/60">Response</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div 
                      className="bg-cyan-400 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 2, delay: 1.7 }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-mono font-bold text-lg">∞</div>
                  <div className="text-cyan-300/60">Context Memory</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div 
                      className="bg-purple-400 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, delay: 1.9 }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-mono font-bold text-lg">AES-256</div>
                  <div className="text-cyan-300/60">Security</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div 
                      className="bg-red-400 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, delay: 2.1 }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Live Activity Feed */}
              <div className="border-t border-cyan-500/20 pt-4">
                <div className="text-cyan-300/70 text-xs mb-2 text-center">Live System Activity</div>
                <div className="space-y-1 text-xs font-mono">
                  <motion.div 
                    className="flex justify-between text-green-400/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                  >
                    <span>Neural Core Initialize...</span>
                    <span className="text-green-400">✓ READY</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between text-cyan-400/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.3 }}
                  >
                    <span>Context Engine Status...</span>
                    <span className="text-cyan-400">✓ ONLINE</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between text-blue-400/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.6 }}
                  >
                    <span>Security Protocols...</span>
                    <span className="text-blue-400">✓ ACTIVE</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.button 
              onClick={handleSignup}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 40px rgba(0, 200, 255, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Activate SYNAPSE AI</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <motion.div
                className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:w-full transition-all duration-700"
                style={{ skewX: "-12deg" }}
              />
            </motion.button>
            
            <motion.button 
              onClick={handleLogin}
              className="px-12 py-4 border-2 border-cyan-400/30 rounded-lg text-lg font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 text-cyan-200 hover:text-cyan-100 relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgba(0, 255, 255, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Experience Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Enhanced Features Grid */}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Core AI Technologies
            </h2>
            <p className="text-cyan-300/60 text-xl mb-8">
              Advanced neural architecture engineered for intelligent personal assistance
            </p>
            
            {/* Technology Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="p-3 bg-gray-900/30 rounded-lg border border-cyan-500/20">
                <div className="text-cyan-400 text-2xl mb-2">⚡</div>
                <div className="text-sm text-cyan-300/80">Real-time Processing</div>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg border border-purple-500/20">
                <div className="text-purple-400 text-2xl mb-2">🔗</div>
                <div className="text-sm text-purple-300/80">Neural Networks</div>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg border border-blue-500/20">
                <div className="text-blue-400 text-2xl mb-2">🛡️</div>
                <div className="text-sm text-blue-300/80">Secure Processing</div>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg border border-green-500/20">
                <div className="text-green-400 text-2xl mb-2">🎯</div>
                <div className="text-sm text-green-300/80">Adaptive Learning</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative group p-8 rounded-2xl bg-gray-900/40 backdrop-blur-sm border ${feature.borderColor} hover:border-opacity-60 transition-all duration-500 overflow-hidden cursor-pointer ${activeFeature === index ? 'ring-2 ring-cyan-400/50' : ''}`}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                  scale: activeFeature === index ? 1.02 : 1
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.9 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                {/* Enhanced gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-15 transition-all duration-500`}></div>
                
                {/* Enhanced tech lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
                
                {/* Corner indicators */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/50 rounded-full group-hover:bg-cyan-400 transition-colors duration-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400/30 rounded-full group-hover:bg-cyan-400/60 transition-colors duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="text-xs text-cyan-400/60 font-mono">{feature.tech}</div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-100 group-hover:text-cyan-50 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed text-sm">
                    {feature.desc}
                  </p>

                  {/* Progress indicator for active feature */}
                  {activeFeature === index && (
                    <motion.div
                      className="mt-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.8 }}
                    />
                  )}
                </div>

                {/* Enhanced hover glow effect */}
                <motion.div 
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-500 -z-10`}
                  animate={activeFeature === index ? { opacity: 0.15 } : { opacity: 0 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Status Bar */}
        <motion.div 
          className="mt-20 p-8 bg-gradient-to-r from-gray-900/60 via-gray-800/60 to-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl max-w-5xl w-full relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-cyan-200 mb-3">
                Ready to Elevate Your Productivity?
              </h3>
              <p className="text-cyan-300/70 text-lg leading-relaxed">
                Join the elite community of professionals already transforming their workflow with SYNAPSE AI
              </p>
              <div className="flex items-center justify-center md:justify-start mt-4 space-x-6 text-sm">
                <div className="flex items-center text-green-400">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full mr-2"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Enterprise Ready
                </div>
                <div className="text-cyan-300/60">|</div>
                <div className="text-cyan-300/60">24/7 Support</div>
                <div className="text-cyan-300/60">|</div>
                <div className="text-cyan-300/60">No Setup Required</div>
              </div>
            </div>
            <motion.button 
              onClick={handleSignup}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-xl relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Initialize Now</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                style={{ skewX: "-12deg" }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer HUD */}
      <motion.footer 
        className="relative z-10 border-t border-cyan-500/20 bg-black/60 backdrop-blur-md py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-cyan-300/60 mb-2">
                © 2024 SYNAPSE AI • Advanced Personal Assistant Technology
              </p>
              <p className="text-cyan-400/40 text-sm">
                Powered by next-generation neural architecture and quantum computing
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center text-green-400">
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full mr-2"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                All Systems Operational
              </span>
              <span className="text-cyan-300/60">|</span>
              <span className="text-cyan-300/60">99.97% Uptime</span>
              <span className="text-cyan-300/60">|</span>
              <span className="text-cyan-300/60">Global Network</span>
            </div>
          </div>
          
          {/* System Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-cyan-500/10">
            <div className="text-center">
              <div className="text-cyan-400 text-xs font-mono mb-1">CPU</div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-1.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "23%" }}
                  transition={{ duration: 2, delay: 3 }}
                />
              </div>
              <div className="text-green-400 text-xs mt-1">Optimal</div>
            </div>
            
            <div className="text-center">
              <div className="text-cyan-400 text-xs font-mono mb-1">MEMORY</div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 2, delay: 3.2 }}
                />
              </div>
              <div className="text-blue-400 text-xs mt-1">Stable</div>
            </div>
            
            <div className="text-center">
              <div className="text-cyan-400 text-xs font-mono mb-1">NETWORK</div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-400 to-teal-400 h-1.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "89%" }}
                  transition={{ duration: 2, delay: 3.4 }}
                />
              </div>
              <div className="text-cyan-400 text-xs mt-1">Excellent</div>
            </div>
            
            <div className="text-center">
              <div className="text-cyan-400 text-xs font-mono mb-1">AI CORE</div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "97%" }}
                  transition={{ duration: 2, delay: 3.6 }}
                />
              </div>
              <div className="text-purple-400 text-xs mt-1">Peak</div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Welcome;