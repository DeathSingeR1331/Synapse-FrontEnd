import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ResumeBuilder from '../components/ResumeBuilder';

// --- Icon Component ---
const Icon = ({ name, size = 16, className = "" }) => {
    const icons = {
        'more-vertical': <><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></>,
        'edit': <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></>,
        'chevron-up': <polyline points="18 15 12 9 6 15"></polyline>,
        'chevron-down': <polyline points="6 9 12 15 18 9"></polyline>,
        'user': <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></>,
        'logout': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></>,
        'sun': <><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></>,
        'moon': <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>,
        'message-square': <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>,
        'send': <><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>,
        'plus': <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>,
        'clock': <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>,
        'zap': <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>,
        'toggle-left': <><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle></>,
        'toggle-right': <><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></>,
        'trash-2': <><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></>,
        'copy': <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></>,
        'download': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></>,
        'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></>,
    };
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
};

// --- Helper Components & Data ---
const now = () => new Date().toISOString();

// Chat Options Menu Component
const ChatOptionsMenu = ({ chat, position, onClose, onRename, onDelete, accessToken }) => {
    const menuRef = useRef(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // ✅ FIX: The export function now includes the access token for authentication.
    const handleExport = (format) => {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const exportUrl = `${API_BASE}/api/v1/conversations/${chat.id}/export?format=${format}&token=${accessToken}`;
        window.open(exportUrl, '_blank');
        onClose();
    };

    return (
        <motion.div
            ref={menuRef}
            className="absolute z-50 w-40 bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-700/50 overflow-hidden"
            style={{ top: position.y, left: position.x }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
        >
            <div className="p-1 relative">
                <button
                    onClick={() => { onRename(chat.id); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-700/50 transition-colors duration-200"
                >
                    <Icon name="edit" size={14} /> Rename
                </button>

                {/* ✅ FIX: Moved hover event handlers to this parent div. 
                    This ensures the sub-menu doesn't close when moving the mouse
                    from the "Export" button to the sub-menu options. */}
                <div
                    onMouseEnter={() => setShowExportMenu(true)}
                    onMouseLeave={() => setShowExportMenu(false)}
                    className="relative"
                >
                    <button className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-700/50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                            <Icon name="download" size={14} /> Export
                        </div>
                        <span className="text-xs">▶</span>
                    </button>
                    <AnimatePresence>
                        {showExportMenu && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="absolute left-full -top-1 ml-1 w-32 bg-gray-800 rounded-lg shadow-2xl border border-gray-700/50 overflow-hidden"
                            >
                                <button onClick={() => handleExport('md')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700/50">Markdown</button>
                                <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700/50">CSV</button>
                                <button onClick={() => handleExport('pdf')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700/50">PDF</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="h-px bg-gray-700/50 my-1"></div>

                <button
                    onClick={() => { onDelete(chat.id); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-500/20 text-red-400 transition-colors duration-200"
                >
                    <Icon name="trash-2" size={14} /> Delete
                </button>
            </div>
        </motion.div>
    );
};


const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, apiCall, accessToken } = useAuth();

    // --- State Management ---
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [clarification, setClarification] = useState(null);
    const [clarificationInput, setClarificationInput] = useState('');
    const [theme, setTheme] = useState('dark');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [isPersonalizationEnabled, setIsPersonalizationEnabled] = useState(true);
    const [chatMode, setChatMode] = useState('personalization'); // 'personalization' | 'tools' | 'both'

    // UI state
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [renamingChatId, setRenamingChatId] = useState(null);
    const [renameInputValue, setRenameInputValue] = useState("");
    const [chatMenu, setChatMenu] = useState({ visible: false, chat: null, x: 0, y: 0 });
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [copySuccessId, setCopySuccessId] = useState(null);
    const [showJumpToLatest, setShowJumpToLatest] = useState(false);
    const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);

    // --- Refs ---
    const ws = useRef(null);
    const jobMapRef = useRef({});
    const activeChatIdRef = useRef(activeChatId);
    const chatEndRef = useRef(null);
    const profileMenuRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // --- Effects for fetching & WS ---
    useEffect(() => {
        const fetchConversations = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await apiCall('/api/v1/conversations/');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations.');
                }
                const data = await response.json();
                const formattedChats = data.map(chat => ({
                    id: chat.uuid,
                    title: chat.title,
                    messages: chat.messages.map(msg => ({
                        role: msg.role,
                        text: msg.content
                    })),
                    timestamp: new Date(chat.updated_at)
                })).sort((a, b) => b.timestamp - a.timestamp);

                setChats(formattedChats);

                if (formattedChats.length > 0 && !activeChatId) {
                    setActiveChatId(formattedChats[0].id);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchConversations();
    }, [isAuthenticated, apiCall]);

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
                            newMessages[lastMessageIndex] = { role: 'assistant', text: finalAnswer, mode: chatMode };
                        } else {
                            newMessages.push({ role: 'assistant', text: finalAnswer, mode: chatMode });
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
                                newMessages[lastMessageIndex] = { role: 'assistant', text: data.initial_response, mode: chatMode };
                            } else {
                                newMessages.push({ role: 'assistant', text: data.initial_response, mode: chatMode });
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
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeChatId, clarification]);

    useEffect(() => { 
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleNewChat = () => {
        const newId = crypto.randomUUID();
        const newChat = {
            id: newId,
            title: `New Chat`,
            messages: [{ role: 'assistant', text: "Hello! How can I help you today?" }],
            timestamp: new Date()
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newId);
        setClarification(null);
    };

    const handleSend = async (messageText = chatInput) => {
        const content = messageText.trim();
        if (!content || !activeChatId) return;

        const userMsg = { role: 'user', text: content, mode: chatMode };
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
            // Handle different chat modes
            if (chatMode === 'tools') {
                // Tools mode: Call local MCP API server
                try {
                    const mcpResponse = await fetch(`${import.meta.env.VITE_MCP_API_URL || 'http://localhost:8001'}/query`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: content,
                            user_id: user?.uuid || 'anonymous'
                        }),
                    });

                    if (!mcpResponse.ok) {
                        throw new Error(`MCP API error: ${mcpResponse.status}`);
                    }

                    const mcpResult = await mcpResponse.json();

                    // Update UI with MCP response
                    setIsTyping(false);
                    setChats(prev => prev.map(chat => {
                        if (chat.id === tempActiveChatId) {
                            const newMessages = [...chat.messages];
                            const lastMessageIndex = newMessages.length - 1;
                            if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].thinking) {
                                newMessages[lastMessageIndex] = {
                                    role: 'assistant',
                                    text: mcpResult.response,
                                    mode: chatMode
                                };
                            }
                            return { ...chat, messages: newMessages };
                        }
                        return chat;
                    }));
                } catch (mcpError) {
                    // If MCP server is not available, fall back to backend API
                    console.warn('MCP server not available, falling back to backend API:', mcpError);
                    
                    // Use backend API as fallback
                    const response = await apiCall(`/api/v1/conversations/${tempActiveChatId}/messages`, {
                        method: 'POST',
                        body: JSON.stringify({
                            content: content,
                            role: 'user'
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Backend API error: ${response.status}`);
                    }

                    const result = await response.json();
                    setIsTyping(false);
                    setChats(prev => prev.map(chat => {
                        if (chat.id === tempActiveChatId) {
                            const newMessages = [...chat.messages];
                            const lastMessageIndex = newMessages.length - 1;
                            if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].thinking) {
                                newMessages[lastMessageIndex] = {
                                    role: 'assistant',
                                    text: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
                                    mode: chatMode
                                };
                            }
                            return { ...chat, messages: newMessages };
                        }
                        return chat;
                    }));
                }

            } else {
                // Personalization or Both mode: Use backend API
                const response = await apiCall(`/api/v1/conversations/${tempActiveChatId}/messages`, {
                    method: 'POST',
                    body: JSON.stringify({
                        content: content,
                        is_personalization_enabled: chatMode === 'personalization' || chatMode === 'both',
                        chat_mode: chatMode
                    }),
                });

                if (!response.ok) throw new Error('Failed to send message.');

                const createdMessage = await response.json();
                if (createdMessage.job_id) {
                    jobMapRef.current[createdMessage.job_id] = createdMessage.conversation_id || tempActiveChatId;
                }
            }
        } catch (error) {
            console.error(`[${now()}] handleSend: Error:`, error);
            
            // Provide user-friendly error messages
            let errorMessage = 'I apologize, but I encountered an issue processing your request. ';
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Please check your internet connection and try again.';
            } else if (error.message.includes('401')) {
                errorMessage += 'Please log in again to continue.';
            } else if (error.message.includes('500')) {
                errorMessage += 'The server is temporarily unavailable. Please try again in a moment.';
            } else {
                errorMessage += 'Please try again or contact support if the issue persists.';
            }
            
            const errorMsg = { role: 'assistant', text: errorMessage };
            setIsTyping(false);
            setChats(prev => prev.map(chat => {
                if (chat.id === tempActiveChatId) {
                    return { ...chat, messages: chat.messages.map(msg => msg.thinking ? errorMsg : msg) };
                }
                return chat;
            }));
        }
    };

    const handleClarificationResponse = () => {
        const responseText = clarificationInput.trim();
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !responseText) {
            console.error("WebSocket is not connected or input is empty.");
            return;
        }

        ws.current.send(JSON.stringify({
            type: "clarification_response",
            job_id: clarification.job_id,
            response: responseText
        }));

        const userClarificationMsg = { role: 'user', text: responseText, mode: chatMode };
        const thinkingMsg = { role: 'assistant', text: '...', thinking: true };

        setChats(prev => prev.map(chat =>
            chat.id === activeChatId
                ? { ...chat, messages: [...chat.messages, userClarificationMsg, thinkingMsg] }
                : chat
        ));
        setClarification(null);
        setClarificationInput('');
        setIsTyping(true);
    };

    const handleLogout = async () => {
        if (ws.current) ws.current.close();
        await logout();
    };

    const handleOpenChatMenu = (event, chat) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setChatMenu({ visible: true, chat, x: rect.left, y: rect.bottom + 8 });
    };

    const handleStartRename = (chatId) => {
        const chatToRename = chats.find(c => c.id === chatId);
        if (chatToRename) {
            setRenamingChatId(chatId);
            setRenameInputValue(chatToRename.title);
        }
    };

    const handleCancelRename = () => {
        setRenamingChatId(null);
        setRenameInputValue("");
    };

    const handleRenameSubmit = async (chatId) => {
        if (!renameInputValue.trim()) return handleCancelRename();
        try {
            await apiCall(`/api/v1/conversations/${chatId}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: renameInputValue }),
            });
            setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: renameInputValue } : c));
        } catch (error) {
            console.error("Error renaming chat:", error);
        } finally {
            handleCancelRename();
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await apiCall(`/api/v1/conversations/${chatId}`, { method: 'DELETE' });
            const remainingChats = chats.filter(c => c.id !== chatId);
            setChats(remainingChats);
            if (activeChatId === chatId) {
                setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    const copyMessageToClipboard = async (text, msgId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccessId(msgId);
            setTimeout(() => setCopySuccessId(null), 1500);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    const handleMessagesScroll = (e) => {
        const node = e.target;
        const threshold = 120;
        const isAway = node.scrollHeight - (node.scrollTop + node.clientHeight) > threshold;
        setShowJumpToLatest(isAway);
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
            setShowJumpToLatest(false);
        } else if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const activeChat = chats.find(chat => chat.id === activeChatId);
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-800 pointer-events-none">
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
            </div>

            <motion.div
                className={`relative z-20 bg-gradient-to-b from-gray-100/95 via-white/95 to-gray-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-lg border-r border-cyan-500/20 flex flex-col justify-between shadow-2xl transition-all duration-500 ease-out ${isSidebarExpanded ? 'w-80' : 'w-20'} min-h-0`}
                initial={false}
                animate={{ width: isSidebarExpanded ? 320 : 80 }}
            >
                <div className="p-6 flex-grow flex flex-col min-h-0">
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
                                    <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                            <Icon name="zap" size={20} className="text-white relative z-10" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                                        </div>
                                    </motion.div>
                                    <div>
                                        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">SYNAPSE AI</h1>
                                        <p className="text-xs text-cyan-300/60 font-mono">Neural Assistant</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-200/50 hover:bg-gray-300/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 transition-all duration-300 border border-cyan-500/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <motion.div animate={{ rotate: theme === 'dark' ? 0 : 180 }} transition={{ duration: 0.5 }}>
                                {theme === 'light' ? <Icon name="moon" size={18} className="text-gray-600" /> : <Icon name="sun" size={18} className="text-yellow-400" />}
                            </motion.div>
                        </motion.button>
                    </div>

                    <motion.button onClick={handleNewChat} className={`w-full flex items-center gap-3 text-white py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg relative overflow-hidden group transition-all duration-300 ${!isSidebarExpanded && 'justify-center'}`} whileHover={{ scale: 1.02 }}>
                        <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}><Icon name="plus" size={20} /></motion.div>
                        <AnimatePresence>{isSidebarExpanded && (<motion.span className="font-medium" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>New Chat</motion.span>)}</AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>

                    <AnimatePresence>
                        {isSidebarExpanded && (
                            <motion.div className="mt-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                <div className="w-full bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-cyan-300/80">Chat Mode</span>
                                    </div>
                                    <select
                                        value={chatMode}
                                        onChange={(e) => setChatMode(e.target.value)}
                                        className="w-full bg-gray-700/50 text-white text-sm py-2 px-3 rounded-lg border border-gray-600/50 focus:outline-none focus:border-cyan-500/50"
                                    >
                                        <option value="personalization">🧠 Personalization</option>
                                        <option value="tools">🔧 Tools</option>
                                        <option value="both">🚀 Both</option>
                                    </select>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {chatMode === 'personalization' && '💡 I\'ll remember our conversation and learn from it'}
                                        {chatMode === 'tools' && '⚡ I\'ll execute tools immediately without memory'}
                                        {chatMode === 'both' && '🌟 I\'ll use tools with conversation context'}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isSidebarExpanded && (
                            <motion.div className="mt-6 flex-grow flex flex-col min-h-0" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                <div className="flex items-center justify-between py-2 px-1 mb-3">
                                    <span className="flex items-center gap-2 text-cyan-300/80 text-sm font-medium"><Icon name="clock" size={16} /> Recent Chats</span>
                                </div>

                                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-2 min-h-0" style={{ scrollBehavior: 'smooth' }}>
                                    <AnimatePresence>
                                        {chats.length > 0 ? chats.map((chat, index) => (
                                            <motion.div key={chat.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.28, delay: index * 0.03 }} className={`p-3 rounded-lg transition-all duration-300 relative group ${activeChatId === chat.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30' : 'hover:bg-gray-700/50 border border-transparent'}`}>
                                                <div className="flex items-center space-x-3" onClick={() => renamingChatId !== chat.id && setActiveChatId(chat.id)}>
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeChatId === chat.id ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        {renamingChatId === chat.id ? (
                                                            <input type="text" value={renameInputValue} onChange={(e) => setRenameInputValue(e.target.value)} onBlur={() => handleRenameSubmit(chat.id)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(chat.id); if (e.key === 'Escape') handleCancelRename(); }} className="w-full bg-gray-700/80 text-sm font-medium text-white p-1 rounded border border-cyan-500/50 focus:outline-none" autoFocus onClick={(e) => e.stopPropagation()} />
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-medium text-white truncate cursor-pointer">{chat.title}</p>
                                                                <p className="text-xs text-gray-400 truncate cursor-pointer">{chat.messages.length > 1 ? chat.messages[chat.messages.length - 1]?.text.substring(0, 30) + '...' : 'Start a conversation...'}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    {renamingChatId !== chat.id && (
                                                        <button onClick={(e) => handleOpenChatMenu(e, chat)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-600/50 ml-auto flex-shrink-0" title="Chat options">
                                                            <Icon name="more-vertical" size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                {activeChatId === chat.id && (<motion.div layoutId="activeIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r" />)}
                                            </motion.div>
                                        )) : (
                                            <motion.div className="text-center py-8 text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <Icon name="message-square" size={32} className="mx-auto mb-3 opacity-50" />
                                                <p className="text-sm">No previous chats yet.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {isSidebarExpanded && (
                        <motion.div className="p-6 border-t border-gray-700/50 space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                            <motion.button 
                                onClick={() => setIsResumeBuilderOpen(true)} 
                                className="w-full flex items-center gap-3 text-sm py-3 px-3 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 border border-transparent hover:border-cyan-500/30" 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon name="file-text" /> <span>Resume Builder</span>
                            </motion.button>
                            <motion.button onClick={handleLogout} className="w-full flex items-center gap-3 text-sm py-3 px-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/30" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Icon name="logout" /> <span>Logout</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-cyan-500/20 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <motion.div animate={{ rotate: isSidebarExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}><Icon name="chevron-up" size={12} className="text-cyan-400" /></motion.div>
                </motion.button>
            </motion.div>

            {/* Chat Options Menu */}
            <AnimatePresence>
                {chatMenu.visible && (
                    <ChatOptionsMenu
                        chat={chatMenu.chat}
                        position={{ x: chatMenu.x, y: chatMenu.y }}
                        onClose={() => setChatMenu({ ...chatMenu, visible: false })}
                        onRename={handleStartRename}
                        onDelete={handleDeleteChat}
                        accessToken={accessToken} // ✅ Pass accessToken for export
                    />
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative z-10 min-h-0">
                {/* Header */}
                <motion.div className="flex justify-between items-center p-6 border-b border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center space-x-4">
                        <AnimatePresence>
                            {activeChat && (
                                <motion.div className="flex items-center space-x-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activeChat.title}</h2>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">AI Assistant • Online</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={profileMenuRef}>
                        <motion.button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="relative p-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-cyan-500/20 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <Icon name="user" size={18} className="text-white" />
                            </div>
                            <motion.div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Profile panel */}
                <AnimatePresence>
                    {isProfileMenuOpen && (
                        <motion.div className="p-4 border-b border-gray-700/40 bg-gray-900/60 backdrop-blur-md z-10" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.12 }}>
                            <div className="max-w-4xl mx-auto flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                    <Icon name="user" size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">{user?.full_name || user?.username || 'User'}</p>
                                            <p className="text-sm text-gray-400">{user?.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* ✅ CORRECTED SETTINGS BUTTON */}
                                            <motion.button
                                                onClick={() => navigate('/settings')}
                                                className="px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/50 text-sm text-gray-200"
                                            >
                                                Settings
                                            </motion.button>
                                            <motion.button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-sm text-red-300">Logout</motion.button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Manage profile, security, and preferences here.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Messages container */}
                <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-0" style={{ scrollBehavior: 'smooth' }}>
                    <AnimatePresence>
                        {activeChat ? (
                            activeChat.messages.map((msg, index) => {
                                const msgId = `${activeChat.id}-${index}`;
                                const isSelected = selectedMsg === msgId;
                                return (
                                    <motion.div key={msgId} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                                        <div className={`max-w-3xl flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <motion.div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`} whileHover={{ scale: 1.05 }}>
                                                {msg.role === 'user' ? <Icon name="user" size={16} className="text-white" /> : <Icon name="zap" size={16} className="text-white" />}
                                            </motion.div>

                                            <motion.div data-msg-id={msgId} className={`relative px-6 py-4 rounded-2xl shadow-lg cursor-text select-text group ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100'} ${isSelected ? 'ring-2 ring-cyan-400/30' : ''}`} whileHover={{ scale: 1.01 }} layout>
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ pointerEvents: 'auto' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); copyMessageToClipboard(msg.text, msgId); }} title="Copy message" className="p-1 rounded-md bg-gray-700/60 hover:bg-gray-700/80">
                                                        <Icon name="copy" size={14} />
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {copySuccessId === msgId && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute -top-6 right-3 text-xs bg-green-600/90 px-2 py-1 rounded-md text-white">
                                                            Copied!
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className={`text-xs font-medium mb-2 opacity-70 flex items-center gap-2 ${msg.role === 'user' ? 'text-cyan-100' : 'text-cyan-400'}`}>
                                                    <span>{msg.role === 'user' ? 'You' : 'Synapse AI'}</span>
                                                    {msg.mode && (
                                                        <span className={`text-xs px-2 py-1 rounded ${msg.mode === 'personalization' ? 'bg-purple-500/20 text-purple-300' :
                                                            msg.mode === 'tools' ? 'bg-blue-500/20 text-blue-300' :
                                                                'bg-green-500/20 text-green-300'
                                                            }`}>
                                                            {msg.mode === 'personalization' ? '🧠' : msg.mode === 'tools' ? '🔧' : '🚀'} {msg.mode}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="selectable-text whitespace-pre-wrap break-words" style={{ userSelect: 'text' }}>
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                </div>

                                                <div className={`text-xs mt-2 opacity-50 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-400'}`}>
                                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>

                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div className="flex flex-col items-center justify-center h-full text-center py-20" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                <motion.div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl" animate={{ rotateY: [0, 360] }} transition={{ rotateY: { duration: 10, repeat: Infinity, ease: "linear" } }}>
                                    <Icon name="message-square" size={36} className="text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-3">Ready to Chat!</h3>
                                <p className="text-gray-400 text-lg mb-6 max-w-md">Start a new conversation with your AI assistant</p>
                                <motion.button onClick={handleNewChat} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300" whileHover={{ scale: 1.05 }}>Start First Chat</motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={chatEndRef} />
                </div>

                {/* Clarification (above input) */}
                <AnimatePresence>
                    {clarification && activeChatId && (
                        <motion.div className="mx-6 mb-4 p-6 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-lg rounded-2xl border border-cyan-500/30 shadow-2xl z-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0"><Icon name="zap" size={20} className="text-white" /></div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white mb-2">Need Clarification</h4>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{clarification.query_text}</p>
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={clarificationInput} onChange={(e) => setClarificationInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleClarificationResponse()} placeholder="Type your answer here..." className="flex-grow bg-gray-700/50 text-white placeholder-gray-400 p-3 rounded-lg border border-cyan-500/30 focus:outline-none" autoFocus />
                                        <motion.button onClick={handleClarificationResponse} className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Icon name="send" /></motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input (sticky) */}
                <motion.div className="flex-none p-6 border-t border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg sticky bottom-0 z-30" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="max-w-4xl mx-auto">
                        <motion.div className="relative bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden" whileFocus={{ borderColor: "rgba(0, 255, 255, 0.5)", boxShadow: "0 0 30px rgba(0, 200, 255, 0.2)" }}>
                            <div className="flex items-end gap-4 p-4">
                                <div className="flex-1">
                                    <motion.textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={activeChatId ? "Type your message..." : "Start a new chat to begin"} className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none text-sm leading-relaxed min-h-[24px] max-h-32" disabled={!activeChatId || !!clarification} rows={1} style={{ height: 'auto', minHeight: '24px' }} onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} />
                                </div>

                                <motion.button onClick={() => handleSend()} disabled={!activeChatId || !!clarification || !chatInput.trim()} className={`p-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${!activeChatId || !!clarification || !chatInput.trim() ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-xl'}`} whileHover={!activeChatId || !!clarification || !chatInput.trim() ? {} : { scale: 1.05, boxShadow: "0 0 25px rgba(0, 200, 255, 0.4)" }} whileTap={!activeChatId || !!clarification || !chatInput.trim() ? {} : { scale: 0.95 }}>
                                    <motion.div animate={isTyping ? { rotate: 360 } : {}} transition={isTyping ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}><Icon name="send" size={18} /></motion.div>
                                </motion.button>
                            </div>

                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div className="px-4 pb-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                        <div className="flex items-center gap-2 text-xs text-cyan-400">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Icon name="zap" size={12} /></motion.div>
                                            <span>AI is thinking...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div className="flex justify-center mt-4 gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            <span className="text-xs text-gray-500 flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-gray-700/50 rounded border border-gray-600/50 text-xs">Enter</kbd>
                                <span>to send</span>
                                <kbd className="px-2 py-1 bg-gray-700/50 rounded border border-gray-600/50 text-xs">Shift + Enter</kbd>
                                <span>for new line</span>
                            </span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Jump to latest floating button */}
                <AnimatePresence>
                    {showJumpToLatest && (
                        <motion.button onClick={scrollToBottom} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.18 }} className="fixed bottom-28 right-8 z-40 bg-cyan-600 hover:bg-cyan-700 p-3 rounded-full shadow-xl">
                            <Icon name="chevron-down" size={20} className="text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Resume Builder Modal */}
            <ResumeBuilder 
                isOpen={isResumeBuilderOpen} 
                onClose={() => setIsResumeBuilderOpen(false)} 
            />

            {/* Small CSS */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(75,85,99,0.06); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.48); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.7); }
                .custom-scrollbar { scroll-behavior: smooth; }
                .selectable-text { user-select: text; }
                .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
            `}</style>
        </div>
    );
};

export default Dashboard;