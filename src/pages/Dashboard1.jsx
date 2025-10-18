// src/pages/Dashboard.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMoreVertical, FiEdit, FiFolder, FiChevronUp, FiChevronDown, FiUser,
    FiLogOut, FiSun, FiMoon, FiSettings, FiMessageSquare, FiSend, FiPlus,
    FiClock, FiZap, FiShield
} from 'react-icons/fi';

// --- Unchanged Helper Components & Data ---
const translations = { en: { synapse: "Synapse", newChat: "New Chat", previousChats: "Previous Chats", logout: "Logout", typeAMessage: "Type a message...", send: "Send", you: "You", synapseAI: "Synapse AI", startNewConversation: "Start a new conversation!", noPreviousChats: "No previous chats yet.", initialMessage: "Hello! How can I help you today?", settings: "Settings", toggleTheme: "Toggle Theme" }};
const ChatOptionsMenu = ({ chatId, position, onClose, t, setRenamingChat, handleDelete }) => { /* ... unchanged ... */ return null; };
const now = () => new Date().toISOString();

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, apiCall, accessToken } = useAuth();
    
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [clarification, setClarification] = useState(null);

    const ws = useRef(null); 
    const jobMapRef = useRef({});
    const activeChatIdRef = useRef(activeChatId);

    const [theme, setTheme] = useState('dark');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const profileMenuRef = useRef(null);
    useEffect(() => {
        const fetchConversations = async () => {
            // Only fetch if the user is authenticated.
            if (!isAuthenticated) return;
            try {
                const response = await apiCall('/api/v1/conversations/');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations.');
                }
                const data = await response.json();

                // Format the backend data to match the frontend's state structure.
                const formattedChats = data.map(chat => ({
                    id: chat.uuid,
                    title: chat.title,
                    // Map the 'content' field from the backend to the 'text' field used in the frontend.
                    messages: chat.messages.map(msg => ({
                        role: msg.role,
                        text: msg.content
                    })),
                    timestamp: new Date(chat.updated_at)
                }));
                
                setChats(formattedChats);
                
                // For a better UX, automatically select the most recent chat.
                if (formattedChats.length > 0) {
                    setActiveChatId(formattedChats[0].id);
                }

            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
        // This effect will run whenever the user's authentication status changes.
    }, [isAuthenticated, apiCall]);
    // ✅ =================== END OF NEW useEffect HOOK ===================


    useEffect(() => {
        activeChatIdRef.current = activeChatId;
        if (clarification && clarification.job_id) {
            const activeChatHasJob = Object.values(jobMapRef.current).includes(activeChatId);
            if (!activeChatHasJob) {
                setClarification(null);
            }
        }
    }, [activeChatId]);

    useEffect(() => {
        if (!isAuthenticated || !user?.uuid || !accessToken) {
            if (ws.current) { ws.current.close(); ws.current = null; }
            return;
        }

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            return;
        }

        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const wsUrl = import.meta.env.VITE_WS_BASE_URL || API_BASE.replace(/^http/, 'ws');
        const socket = new WebSocket(`${wsUrl}/ws/${user.uuid}?token=${accessToken}`);
        ws.current = socket;

        socket.onopen = () => console.info(`[${now()}] WS onopen: connection ESTABLISHED`);
        socket.onerror = (error) => console.error(`[${now()}] WS onerror:`, error);
        socket.onclose = (event) => {
            console.warn(`[${now()}] WS onclose: Code: ${event.code}`);
            ws.current = null;
        };

        socket.onmessage = (event) => {
            console.debug(`[${now()}] WS onmessage: raw event:`, event.data);
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                console.error(`[${now()}] WS parse error:`, e);
                return;
            }

            const targetConversationId = data.conversation_id || jobMapRef.current[data.job_id] || activeChatIdRef.current;
            
            if (!targetConversationId) {
                console.warn(`[${now()}] WS: Could not resolve a target conversation ID for job ${data.job_id}.`);
                return;
            }

            if (data.status === 'COMPLETED' && data.result) {
                const finalAnswer = data.result.response;
                setClarification(null);
                setIsTyping(false);
                
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id === targetConversationId) {
                        const newMessages = [...chat.messages];
                        const lastMessageIndex = newMessages.length - 1;
                        if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].thinking) {
                            newMessages[lastMessageIndex] = { role: 'assistant', text: finalAnswer };
                        } else {
                            newMessages.push({ role: 'assistant', text: finalAnswer });
                        }
                        return { ...chat, messages: newMessages };
                    }
                    return chat;
                }));

            } else if (data.status === 'AWAITING_CLARIFICATION') {
                setIsTyping(false);
                setChats(prevChats => prevChats.map(chat => {
                    if (chat.id === targetConversationId) {
                        const newMessages = [...chat.messages];
                        if (data.initial_response) {
                            const lastMessageIndex = newMessages.length - 1;
                            if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].thinking) {
                                newMessages[lastMessageIndex] = { role: 'assistant', text: data.initial_response };
                            } else {
                                newMessages.push({ role: 'assistant', text: data.initial_response });
                            }
                        }
                        return { ...chat, messages: newMessages };
                    }
                    return chat;
                }));
                setClarification(data.clarification_request);
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated, user, accessToken]);

    useEffect(() => { 
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }, [chats, activeChatId, clarification]);

    useEffect(() => { 
        document.documentElement.className = theme; 
    }, [theme]);

    const t = (key) => translations.en[key] || key;

    const handleNewChat = () => {
        const newId = crypto.randomUUID();
        const newChat = { 
            id: newId, 
            title: `New Chat`, 
            messages: [{ role: 'assistant', text: t('initialMessage') }],
            timestamp: new Date()
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newId);
        setClarification(null);
    };

    const handleSend = async (messageText = chatInput) => {
        const content = messageText.trim();
        if (!content || !activeChatId) return;

        const userMsg = { role: 'user', text: content };
        const thinkingMsg = { role: 'assistant', text: '...', thinking: true };
        const tempActiveChatId = activeChatId; 
        setChatInput('');
        setClarification(null);
        setIsTyping(true);

        setChats(prev => prev.map(chat => 
            chat.id === tempActiveChatId 
                ? { ...chat, messages: [...chat.messages, userMsg, thinkingMsg] } 
                : chat
        ));

        try {
            const response = await apiCall(`/api/v1/conversations/${tempActiveChatId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content: content }),
            });

            if (!response.ok) throw new Error('Failed to send message.');
            
            const createdMessage = await response.json();
            if (createdMessage.job_id) {
                jobMapRef.current[createdMessage.job_id] = createdMessage.conversation_id || tempActiveChatId;
            }
        } catch (error) {
            console.error(`[${now()}] handleSend: Error:`, error);
            const errorMsg = { role: 'assistant', text: `Error: ${error.message}` };
            setIsTyping(false);
            setChats(prev => prev.map(chat => {
                if (chat.id === tempActiveChatId) { 
                    return { ...chat, messages: chat.messages.map(msg => msg.thinking ? errorMsg : msg) };
                }
                return chat;
            }));
        }
    };
    
    const handleClarificationResponse = (response) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected.");
            return;
        }
        const payload = {
            type: "clarification_response",
            job_id: clarification.job_id,
            response: response
        };
        ws.current.send(JSON.stringify(payload));
        
        const userClarificationMsg = { role: 'user', text: response };
        const thinkingMsg = { role: 'assistant', text: '...', thinking: true };
        
        setChats(prev => prev.map(chat => 
            chat.id === activeChatId 
                ? { ...chat, messages: [...chat.messages, userClarificationMsg, thinkingMsg] } 
                : chat
        ));
        setClarification(null);
        setIsTyping(true);
    };

    const handleLogout = async () => {
        if (ws.current) ws.current.close();
        await logout();
    };
    
    const activeChat = chats.find(chat => chat.id === activeChatId);
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    
    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0"
                         style={{
                           backgroundImage: `
                             linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)
                           `,
                           backgroundSize: '50px 50px'
                         }}>
                    </div>
                </div>
                
                {/* Floating orbs */}
                <motion.div 
                  className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05],
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
                  className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-8"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.08, 0.15, 0.08],
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
            </div>

            {/* Enhanced Sidebar */}
            <motion.div 
                className={`relative z-20 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-r border-cyan-500/20 flex flex-col justify-between shadow-2xl transition-all duration-500 ease-out ${isSidebarExpanded ? 'w-80' : 'w-20'}`}
                initial={false}
                animate={{ width: isSidebarExpanded ? 320 : 80 }}
            >
                {/* Enhanced Header */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <AnimatePresence>
                            {isSidebarExpanded && (
                                <motion.div 
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Enhanced SYNAPSE Logo */}
                                    <motion.div 
                                        className="relative"
                                        whileHover={{ scale: 1.05 }}
                                        animate={{ 
                                            boxShadow: [
                                                "0 0 20px rgba(0, 255, 255, 0.3)",
                                                "0 0 40px rgba(0, 255, 255, 0.6)",
                                                "0 0 20px rgba(0, 255, 255, 0.3)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                            <svg 
                                                className="w-6 h-6 text-white relative z-10" 
                                                viewBox="0 0 32 32" 
                                                fill="none"
                                            >
                                                <circle cx="16" cy="16" r="2" fill="currentColor" className="animate-pulse" />
                                                <circle cx="8" cy="8" r="1.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                                                <circle cx="24" cy="8" r="1.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.4s'}} />
                                                <circle cx="8" cy="24" r="1.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                                                <circle cx="24" cy="24" r="1.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.8s'}} />
                                                <motion.path 
                                                    d="M10 10L14 14" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1" 
                                                    opacity="0.6"
                                                    animate={{ pathLength: [0, 1, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />
                                                <motion.path 
                                                    d="M18 14L22 10" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1" 
                                                    opacity="0.6"
                                                    animate={{ pathLength: [0, 1, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                                        </div>
                                    </motion.div>
                                    <div>
                                        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                            SYNAPSE AI
                                        </h1>
                                        <p className="text-xs text-cyan-300/60 font-mono">Neural Assistant</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 border border-cyan-500/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                                transition={{ duration: 0.5 }}
                            >
                                {theme === 'light' ? <FiMoon size={18} className="text-cyan-400" /> : <FiSun size={18} className="text-cyan-400" />}
                            </motion.div>
                        </motion.button>
                    </div>
                    
                    {/* Enhanced New Chat Button */}
                    <motion.button 
                        onClick={handleNewChat} 
                        className={`w-full flex items-center gap-3 text-white py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg relative overflow-hidden group transition-all duration-300 ${!isSidebarExpanded && 'justify-center'}`}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FiPlus size={20} />
                        </motion.div>
                        <AnimatePresence>
                            {isSidebarExpanded && (
                                <motion.span 
                                    className="font-medium"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    New Chat
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                    
                    {/* Enhanced Chats List */}
                    <AnimatePresence>
                        {isSidebarExpanded && (
                            <motion.div 
                                className="mt-6"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between py-2 px-1 mb-3">
                                    <span className="flex items-center gap-2 text-cyan-300/80 text-sm font-medium">
                                        <FiClock size={16} />
                                        Recent Chats
                                    </span>
                                </div>
                                
                                <div className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar space-y-2">
                                    <AnimatePresence>
                                        {chats.length > 0 ? chats.map((chat, index) => (
                                            <motion.div
                                                key={chat.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                onClick={() => setActiveChatId(chat.id)} 
                                                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 relative group ${
                                                    activeChatId === chat.id 
                                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30' 
                                                        : 'hover:bg-gray-700/50 border border-transparent'
                                                }`}
                                                whileHover={{ x: 5 }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2 h-2 rounded-full ${activeChatId === chat.id ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {chat.messages[chat.messages.length - 1]?.text.substring(0, 30) + '...'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {activeChatId === chat.id && (
                                                    <motion.div 
                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r"
                                                        layoutId="activeIndicator"
                                                    />
                                                )}
                                            </motion.div>
                                        )) : (
                                            <motion.div 
                                                className="text-center py-8 text-gray-400"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <FiMessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                                                <p className="text-sm">No previous chats yet.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Enhanced Footer */}
                <AnimatePresence>
                    {isSidebarExpanded && (
                        <motion.div 
                            className="p-6 border-t border-gray-700/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <motion.button 
                                onClick={handleLogout} 
                                className="w-full flex items-center gap-3 text-sm py-3 px-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/30"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiLogOut /> 
                                <span>Logout</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle */}
                <motion.button
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-cyan-500/20 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={{ rotate: isSidebarExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FiChevronUp size={12} className="text-cyan-400" />
                    </motion.div>
                </motion.button>
            </motion.div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Enhanced Header */}
                <motion.div 
                    className="flex justify-between items-center p-6 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-lg"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center space-x-4">
                        <AnimatePresence>
                            {activeChat && (
                                <motion.div 
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{activeChat.title}</h2>
                                        <p className="text-xs text-gray-400">AI Assistant • Online</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Enhanced Profile Menu */}
                    <div className="relative" ref={profileMenuRef}>
                        <motion.button 
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                            className="relative p-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-cyan-500/20 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <FiUser size={18} className="text-white" />
                            </div>
                            <motion.div 
                                className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button>
                        
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div 
                                    className="absolute right-0 mt-3 w-64 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 z-50 overflow-hidden"
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                                <FiUser size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{user?.full_name || user?.username || 'User'}</p>
                                                <p className="text-sm text-gray-400">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <motion.button 
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                                            whileHover={{ x: 5 }}
                                        >
                                            <FiSettings size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-300">Settings</span>
                                        </motion.button>
                                        <motion.button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
                                            whileHover={{ x: 5 }}
                                        >
                                            <FiLogOut size={16} />
                                            <span className="text-sm">Logout</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
                
                {/* Enhanced Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    <AnimatePresence>
                        {activeChat ? (
                            activeChat.messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ 
                                        duration: 0.4, 
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20
                                    }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                                >
                                    <div className={`max-w-3xl flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar */}
                                        <motion.div 
                                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                msg.role === 'user' 
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                                                    : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                            }`}
                                            whileHover={{ scale: 1.1 }}
                                            animate={msg.role === 'assistant' && msg.thinking ? { 
                                                rotate: [0, 360],
                                                transition: { duration: 2, repeat: Infinity, ease: "linear" }
                                            } : {}}
                                        >
                                            {msg.role === 'user' ? (
                                                <FiUser size={16} className="text-white" />
                                            ) : (
                                                <motion.div
                                                    animate={msg.thinking ? { scale: [1, 1.2, 1] } : {}}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <FiZap size={16} className="text-white" />
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Message Bubble */}
                                        <motion.div 
                                            className={`relative px-6 py-4 rounded-2xl shadow-lg ${
                                                msg.role === 'user' 
                                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                                                    : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            layout
                                        >
                                            {/* Message Header */}
                                            <div className={`text-xs font-medium mb-2 opacity-70 ${
                                                msg.role === 'user' ? 'text-cyan-100' : 'text-cyan-400'
                                            }`}>
                                                {msg.role === 'user' ? 'You' : 'Synapse AI'}
                                            </div>
                                            
                                            {/* Message Content */}
                                            {msg.thinking ? (
                                                <motion.div 
                                                    className="flex items-center space-x-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="flex space-x-1">
                                                        {[0, 1, 2].map((i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="w-2 h-2 bg-cyan-400 rounded-full"
                                                                animate={{
                                                                    scale: [1, 1.5, 1],
                                                                    opacity: [0.5, 1, 0.5]
                                                                }}
                                                                transition={{
                                                                    duration: 1.5,
                                                                    repeat: Infinity,
                                                                    delay: i * 0.2
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-cyan-300">Thinking...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                        {msg.text}
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Message timestamp */}
                                            <div className={`text-xs mt-2 opacity-50 ${
                                                msg.role === 'user' ? 'text-cyan-100' : 'text-gray-400'
                                            }`}>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            {/* Glow effect for AI messages */}
                                            {msg.role === 'assistant' && !msg.thinking && (
                                                <motion.div 
                                                    className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-cyan-500/20 rounded-2xl blur opacity-0"
                                                    animate={{ opacity: [0, 0.5, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
                                    animate={{ 
                                        rotateY: [0, 360],
                                        boxShadow: [
                                            "0 0 20px rgba(0, 255, 255, 0.3)",
                                            "0 0 40px rgba(0, 255, 255, 0.6)",
                                            "0 0 20px rgba(0, 255, 255, 0.3)"
                                        ]
                                    }}
                                    transition={{ 
                                        rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                                        boxShadow: { duration: 2, repeat: Infinity }
                                    }}
                                >
                                    <FiMessageSquare size={36} className="text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-3">Ready to Chat!</h3>
                                <p className="text-gray-400 text-lg mb-6 max-w-md">
                                    Start a new conversation with your AI assistant
                                </p>
                                <motion.button
                                    onClick={handleNewChat}
                                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 200, 255, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start First Chat
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>
                
                {/* Enhanced Clarification Prompt */}
                <AnimatePresence>
                    {clarification && activeChatId && (
                        <motion.div 
                            className="mx-6 mb-4 p-6 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-lg rounded-2xl border border-cyan-500/30 shadow-2xl"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-start gap-4">
                                <motion.div 
                                    className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <FiZap size={20} className="text-white" />
                                </motion.div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white mb-2">Need Clarification</h4>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{clarification.query_text}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {clarification.options.map((option, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleClarificationResponse(option)}
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                whileHover={{ 
                                                    scale: 1.05,
                                                    boxShadow: "0 0 20px rgba(0, 200, 255, 0.4)" 
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="relative z-10">{option}</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enhanced Chat Input */}
                <motion.div 
                    className="p-6 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="max-w-4xl mx-auto">
                        <motion.div 
                            className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
                            whileFocus={{ 
                                borderColor: "rgba(0, 255, 255, 0.5)",
                                boxShadow: "0 0 30px rgba(0, 200, 255, 0.2)"
                            }}
                        >
                            <div className="flex items-end gap-4 p-4">
                                <div className="flex-1">
                                    <motion.textarea
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder={activeChatId ? "Type your message..." : "Start a new chat to begin"}
                                        className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-sm leading-relaxed min-h-[24px] max-h-32"
                                        disabled={!activeChatId || !!clarification}
                                        rows={1}
                                        style={{ 
                                            height: 'auto',
                                            minHeight: '24px'
                                        }}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                    />
                                </div>
                                
                                <motion.button 
                                    onClick={() => handleSend()} 
                                    disabled={!activeChatId || !!clarification || !chatInput.trim()}
                                    className={`p-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                        !activeChatId || !!clarification || !chatInput.trim()
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-xl'
                                    }`}
                                    whileHover={!activeChatId || !!clarification || !chatInput.trim() ? {} : { 
                                        scale: 1.05,
                                        boxShadow: "0 0 25px rgba(0, 200, 255, 0.4)" 
                                    }}
                                    whileTap={!activeChatId || !!clarification || !chatInput.trim() ? {} : { scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={isTyping ? { rotate: 360 } : {}}
                                        transition={isTyping ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                                    >
                                        <FiSend size={18} />
                                    </motion.div>
                                </motion.button>
                            </div>

                            {/* Typing Indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div 
                                        className="px-4 pb-3"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className="flex items-center gap-2 text-xs text-cyan-400">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <FiZap size={12} />
                                            </motion.div>
                                            <span>AI is thinking...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* Quick Actions */}
                        <motion.div 
                            className="flex justify-center mt-4 gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-xs text-gray-500 flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-gray-700/50 rounded border border-gray-600/50 text-xs">Enter</kbd>
                                <span>to send</span>
                                <kbd className="px-2 py-1 bg-gray-700/50 rounded border border-gray-600/50 text-xs">Shift + Enter</kbd>
                                <span>for new line</span>
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            
            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(75, 85, 99, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;