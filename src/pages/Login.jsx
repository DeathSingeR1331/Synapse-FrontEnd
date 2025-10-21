import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initiateGoogleAuth, emailLogin } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // Handle OAuth error from URL parameters
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'oauth_error') {
      setError('Google authentication failed. Please try again.');
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 3000);
    }
  }, [searchParams]);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await emailLogin(credentials);
    setLoading(false);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setError(result.error || 'Login failed');
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 1400);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* --- animated grid & blobs (matches main.jsx) --- */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/4 left-1/5 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ scale: [1.2, 1, 1.2], y: [0, 40, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      {/* --- login card --- */}
      <motion.div
        className="relative z-10 w-full max-w-sm p-8 rounded-2xl bg-gray-900/60 border border-cyan-500/20 backdrop-blur-md shadow-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
          Login
        </h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: '0 0 12px rgba(0,255,255,0.3)' }}
            type="text"
            name="username"
            placeholder="Username or Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none border border-cyan-500/20"
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: '0 0 12px rgba(0,255,255,0.3)' }}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none border border-cyan-500/20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:from-cyan-600 hover:to-blue-700 transition"
          >
            {loading ? 'Logging In…' : 'Login'}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-cyan-500/20" />
          <span className="mx-4 text-cyan-300/60">OR</span>
          <hr className="flex-grow border-cyan-500/20" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initiateGoogleAuth}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition font-medium"
        >
          Continue with Google
        </motion.button>
      </motion.div>

      {/* --- overlay animations --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success"
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="text-4xl font-bold text-cyan-300"
            >
              ✅ Welcome Back!
            </motion.div>
          </motion.div>
        )}

        {showFailure && (
          <motion.div
            key="failure"
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="text-4xl font-bold text-red-400"
            >
              ❌ Login Failed
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Login;
