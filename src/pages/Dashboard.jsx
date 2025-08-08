import React, { useEffect, useRef, useState } from 'react';
import {
  FiMoreVertical, FiMic,
  FiUpload, FiSettings, FiPlus, FiSun, FiMoon,
  FiChevronDown, FiChevronUp, FiFolder, FiMessageSquare,
  FiUser, FiLogOut, FiGithub, FiMail, FiPhoneCall,
  FiImage, FiFileText, FiVideo, FiX, FiBookmark,
  FiEdit
} from 'react-icons/fi';

// --- Translations Object ---
const translations = {
  en: {
    synapse: "Synapse",
    newChat: "New Chat",
    previousChats: "Previous Chats",
    createWorkspace: "Create Workspace",
    settings: "Settings",
    toggleTheme: "Toggle Theme",
    clearHistory: "Clear History",
    logout: "Logout",
    typeAMessage: "Type a message...",
    send: "Send",
    you: "You",
    synapseAI: "Synapse AI",
    startNewConversation: "Start a new conversation!",
    typeMessageToBegin: "Type your message below to begin.",
    noPreviousChats: "No previous chats.",
    userProfile: "User Profile",
    createWorkspaceModalTitle: "Create Workspace",
    createWorkspaceModalDesc: "Create a new workspace to consolidate all your resources.",
    enterWorkspaceName: "Enter the workspace name",
    setFolderLocation: "Select the folder where the workspace is located.",
    enterDescription: "Enter description",
    create: "Create",
    rename: "Rename",
    share: "Share",
    delete: "Delete",
    feedback: "Feedback",
    pin: "Pin",
    chatLinkCopied: "Chat link copied:",
    feedbackSubmitted: "Feedback submitted for Chat",
    speechNotSupported: "Speech recognition not supported in this browser. Please use Chrome.",
    uploaded: "📎 Uploaded:",
    creatingWorkspace: "Creating workspace:",
    workspaceCreated: "Workspace created!",
    loggingOut: "Logging out and returning to welcome page (simulated).",
    moreOptions: "More options",
    connectApps: "Connect Apps:",
    github: "GitHub",
    whatsapp: "WhatsApp",
    gmail: "Gmail",
    welcomeNewChat: (chatNum) => `Welcome to New Chat #${chatNum}! How can I assist you today?`,
    initialMessage: "Hello! How can I help you today?",
    mode: "Mode",
    selectMode: "Select Mode",
    imageMode: "Image Mode",
    documentMode: "Document Mode",
    videoMode: "Video Mode",
    clearSelection: "Clear selection",
    workspaceCreatedMessage: (name) => `Workspace "${name}" has been successfully created!`,
    chatPinned: "Chat pinned!",
    recentChats: "Recent Chats",
    startNewChatBtn: "Start New Chat",
  },
};
// --- End Translations Object ---

// Helper to generate a consistent index from a string
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// --- Fixed palette of Tailwind background colors for workspaces ---
const WORKSPACE_COLORS_LIGHT = [
  'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100',
  'bg-red-100', 'bg-teal-100', 'bg-orange-100', 'bg-lime-100'
];

const WORKSPACE_COLORS_DARK = [
  'bg-blue-700', 'bg-green-700', 'bg-yellow-700', 'bg-purple-700', 'bg-pink-700', 'bg-indigo-700',
  'bg-red-700', 'bg-teal-700', 'bg-orange-700', 'bg-lime-700'
];

const getWorkspaceColorClass = (str, theme) => {
  const index = hashCode(str) % WORKSPACE_COLORS_LIGHT.length;
  return theme === 'dark' ? WORKSPACE_COLORS_DARK[index] : WORKSPACE_COLORS_LIGHT[index];
};
// --- End fixed palette ---


// --- Predefined Folder Options ---
const FOLDER_OPTIONS = [
  "",
  "/projects/synapse_ai",
  "/documents/reports",
  "/my_data/research",
  "/shared/team_files",
  "/user/downloads",
];
// --- End Predefined Folder Options ---


// --- WorkspaceModal Component (Moved Outside Dashboard) ---
const WorkspaceModal = ({ t, newWorkspace, setNewWorkspace, setShowWorkspaceModal, handleCreateWorkspace }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="p-6 rounded w-96 relative bg-white text-black dark:bg-gray-800 dark:text-white">
      <button onClick={() => setShowWorkspaceModal(false)} className="absolute top-2 right-2 text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">&times;</button>
      <h2 className="text-xl font-semibold mb-4">{t('createWorkspaceModalTitle')}</h2>
      <p className="mb-3 text-sm opacity-70">{t('createWorkspaceModalDesc')}</p>
      <input
        type="text"
        placeholder={t('enterWorkspaceName')}
        className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
        value={newWorkspace.name}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
      />
      <select
        className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
        value={newWorkspace.folder}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, folder: e.target.value })}
      >
        <option value="" disabled>{t('setFolderLocation')}</option>
        {FOLDER_OPTIONS.map((path, index) => (
          <option key={index} value={path}>
            {path || "--- Select a folder ---"}
          </option>
        ))}
      </select>
      <textarea
        placeholder={t('enterDescription')}
        className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white h-24 resize-y"
        value={newWorkspace.description}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
      />
      <button
        onClick={handleCreateWorkspace}
        className="w-full bg-indigo-600 py-2 rounded text-white hover:bg-indigo-700 transition-colors"
      >
        {t('create')}
      </button>
    </div>
  </div>
);
// --- End WorkspaceModal Component ---


const ChatOptionsMenu = ({ chatId, position, onClose, t, setRenamingChat, handleDelete, handleShare, handlePin, chatOptionsMenuRef }) => {
  if (!chatId) return null;

  return (
    <div
      ref={chatOptionsMenuRef}
      className="fixed bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 w-36 overflow-hidden"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Share button at top with separator */}
      <button onClick={() => { handleShare(chatId); onClose(); }} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm">{t('share')}</button>
      <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div> {/* Solid line separator */}
      
      {/* Remaining buttons */}
      <button onClick={() => { setRenamingChat(chatId); onClose(); }} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm">{t('rename')}</button>
      <button onClick={() => { handlePin(chatId); onClose(); }} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm">{t('pin')}</button>
      <button onClick={() => { handleDelete(chatId); onClose(); }} className="block px-4 py-2 hover:bg-red-500 hover:text-white w-full text-left text-sm">{t('delete')}</button>
      <button onClick={() => { /* Re-added handleFeedback as it was previously present and useful */ /* Removed handleDownload(chatId) */ onClose(); }} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-sm">{t('feedback')}</button>
    </div>
  );
};


const Dashboard = () => {
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'Chat 1',
      messages: [{ role: 'assistant', text: translations.en.initialMessage }],
      active: true,
      type: 'chat'
    },
  ]);
  const [chatCount, setChatCount] = useState(2);
  const [activeChatId, setActiveChatId] = useState(1);
  const [renamingChat, setRenamingChat] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');
  const language = 'en'; // Hardcode language to English
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', folder: '', description: '' });
  const [isChatHistoryExpanded, setIsChatHistoryExpanded] = useState(true); // Still useful for the full previous chats list
  const chatEndRef = useRef(null);

  const [sidebarWidth, setSidebarWidth] = useState(288); // This state will be less relevant if width is controlled by isSidebarExpanded
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 400;

  const [profileUserName, setProfileUserName] = useState('Random User');
  const [profileUserEmail, setProfileUserEmail] = useState('random.user@example.com');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const settingsButtonRef = useRef(null);

  const [chatMenuOpenForId, setChatMenuOpenForId] = useState(null);
  const chatMenuButtonRefs = useRef({});
  const [chatMenuPosition, setChatMenuPosition] = useState({ top: 0, left: 0 });
  const chatOptionsMenuRef = useRef(null);

  const [showModeSelectorOptions, setShowModeSelectorOptions] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const modeSelectorButtonRef = useRef(null);
  const modeSelectorOptionsRef = useRef(null);

  // --- Sidebar Expansion State (Gemini-style) ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  // --- END NEW STATE ---

  const t = (key, ...args) => {
    let text = translations[language][key] || translations.en[key] || key;
    if (typeof text === 'function') {
      text = text(...args);
    }
    return text;
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideProfile);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideProfile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideSettings = (event) => {
      if (
        showSettings &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target) &&
        event.target.closest('.settings-menu-container') === null
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideSettings);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSettings);
    };
  }, [showSettings]);

  useEffect(() => {
    const handleClickOutsideChatOptions = (event) => {
      if (
        chatMenuOpenForId !== null &&
        chatOptionsMenuRef.current &&
        !chatOptionsMenuRef.current.contains(event.target) &&
        !chatMenuButtonRefs.current[chatMenuOpenForId]?.contains(event.target)
      ) {
        setChatMenuOpenForId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideChatOptions);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideChatOptions);
    };
  }, [chatMenuOpenForId]);


  useEffect(() => {
    const handleClickOutsideModeSelector = (event) => {
      if (
        showModeSelectorOptions &&
        modeSelectorOptionsRef.current &&
        !modeSelectorOptionsRef.current.contains(event.target) &&
        modeSelectorButtonRef.current &&
        !modeSelectorButtonRef.current.contains(event.target)
      ) {
        setShowModeSelectorOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModeSelector);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModeSelector);
    };
  }, [showModeSelectorOptions]);

  // --- Sidebar hover/leave event handlers ---
  const handleMouseEnterSidebar = () => {
    setIsSidebarExpanded(true);
  };
  const handleMouseLeaveSidebar = () => {
    setIsSidebarExpanded(false);
    setShowSettings(false); // Close settings menu when sidebar collapses
  };
  // --- END NEW ---

  const handleToggleChatMenu = (e, chatId) => {
    e.stopPropagation();
    const buttonRect = chatMenuButtonRefs.current[chatId].getBoundingClientRect();
    setChatMenuPosition({
      top: buttonRect.bottom + 5,
      // Adjust left position based on sidebar expansion
      left: isSidebarExpanded ? buttonRect.left - 100 : buttonRect.right + 5
    });
    setChatMenuOpenForId(chatId);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    let newWidth = e.clientX;
    if (newWidth < MIN_SIDEBAR_WIDTH) {
      newWidth = MIN_SIDEBAR_WIDTH;
    } else if (newWidth > MAX_SIDEBAR_WIDTH) {
      newWidth = MAX_SIDEBAR_WIDTH;
    }
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const clearHistory = () => {
    setChats([]);
    setActiveChatId(null);
    setChatCount(1);
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const newMsg = { role: 'user', text: chatInput };
    let assistantResponseText = `(${t('synapseAI')}) ${chatInput}`;

    if (selectedMode) {
      assistantResponseText = `(${t(selectedMode + 'Mode')}) ${chatInput}`;
      setSelectedMode(null);
    }

    const assistantMsg = { role: 'assistant', text: assistantResponseText };

    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, newMsg, assistantMsg] }
        : chat
    ));
    setChatInput('');
  };

  const handleNewChat = () => {
    const newId = chatCount;
    const newChatTitle = `${t('newChat')} ${newId}`;
    const initialAssistantMessage = {
      role: 'assistant',
      text: t('welcomeNewChat', newId)
    };
    const newChat = {
      id: newId,
      title: newChatTitle,
      messages: [initialAssistantMessage],
      active: true,
      type: 'chat'
    };

    setChats(prev => {
      const updatedChats = prev.map(c => ({ ...c, active: false }));
      return [...updatedChats, newChat];
    });
    setChatCount(chatCount + 1);
    setActiveChatId(newId);
    setSelectedMode(null);
    setIsSidebarExpanded(false); // Ensure sidebar collapses after starting new chat
  };

  const handleDelete = (id) => {
    const filtered = chats.filter(chat => chat.id !== id);
    setChats(filtered);
    if (filtered.length) {
      setActiveChatId(filtered[0]?.id || null);
    } else {
      setActiveChatId(null);
    }
    setChatMenuOpenForId(null);
  };

  const handleFeedback = (id) => {
    alert(`${t('feedbackSubmitted')} (ID: ${id})`);
    setChatMenuOpenForId(null);
  };

  const handleShare = (id) => {
    const url = `https://synapse-ai.app/chat/${id}`;
    navigator.clipboard.writeText(url);
    alert(`${t('chatLinkCopied')} ${url}`);
    setChatMenuOpenForId(null);
  };

  const handlePin = (id) => {
    alert(`${t('chatPinned')} (ID: ${id})`);
    setChatMenuOpenForId(null);
  };

  const handleRename = (id, newName) => {
    if (newName.trim() === '') {
      newName = chats.find(c => c.id === id)?.type === 'workspace' ? `Workspace ${id}` : `${t('newChat')} ${id}`;
    }
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newName } : chat));
    setRenamingChat(null);
    setChatMenuOpenForId(null);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert(t('speechNotSupported'));
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => setChatInput(event.results[0][0].transcript);
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMsg = { role: 'user', text: `${t('uploaded')} ${file.name}` };
      setChats(prev => prev.map(chat => chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, fileMsg] } : chat));
    }
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      alert("Please enter a workspace name.");
      return;
    }
    if (!newWorkspace.folder.trim()) {
      alert("Please select a folder location.");
      return;
    }

    const newWorkspaceId = Date.now();
    const newWorkspaceChat = {
      id: newWorkspaceId,
      title: newWorkspace.name,
      messages: [{ role: 'assistant', text: t('workspaceCreatedMessage', newWorkspace.name) }],
      active: true,
      type: 'workspace',
      folderLocation: newWorkspace.folder,
      description: newWorkspace.description
    };

    setChats(prev => {
      const updatedChats = prev.map(c => ({ ...c, active: false }));
      return [...updatedChats, newWorkspaceChat];
    });

    setActiveChatId(newWorkspaceId);
    console.log(`${t('creatingWorkspace')}`, newWorkspace);
    setNewWorkspace({ name: '', folder: '', description: '' });
    setShowWorkspaceModal(false);
    setSelectedMode(null);
  };

  const handleLogout = () => {
    alert(t('loggingOut'));
    setChats([{ id: 1, title: `${t('newChat')} 1`, messages: [{ role: 'assistant', text: t('initialMessage') }], active: true, type: 'chat' }]);
    setChatCount(2);
    setActiveChatId(1);
    setChatInput('');
    setShowSettings(false);
    setNewWorkspace({ name: '', folder: '', description: '' });
    setIsChatHistoryExpanded(true);
    setSelectedMode(null);
  };

  const toggleModeSelector = (e) => {
    e.stopPropagation();
    setShowModeSelectorOptions(prev => !prev);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setShowModeSelectorOptions(false);
  };

  const handleRemoveMode = () => {
    setSelectedMode(null);
  };

  const allChatsSorted = [...chats].sort((a, b) => b.id - a.id); // Sort all chats by ID descending for display

  return (
    <div className="flex h-screen bg-white text-black dark:bg-gray-900 dark:text-white font-sans">
      {/* Sidebar - Refactored for Hovering */}
      <div
        className={`bg-white text-black dark:bg-gray-800 dark:text-white p-4 flex flex-col justify-between relative shadow-lg h-screen transition-all duration-200 ease-in-out
          ${isSidebarExpanded ? 'w-72' : 'w-16'}`}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      >
        <div className="flex flex-col h-full">
          {/* Top Section */}
          <div className="flex justify-between items-center mb-6">
            {isSidebarExpanded && (
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out mr-auto">
                {t('synapse')}
              </span>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isSidebarExpanded ? 'ml-auto' : 'mx-auto'}`}
              title={t('toggleTheme')}
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
          </div>

          {/* New Chat Button / Expanded Content based on isSidebarExpanded */}
          <div className="flex-1 overflow-hidden">
            {!isSidebarExpanded ? (
              // Collapsed state: Only New Chat icon at top
              <div className="flex flex-col items-center justify-start py-2">
                <button
                  onClick={handleNewChat}
                  className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white flex-shrink-0"
                  title={t('newChat')}
                >
                  <FiEdit size={20} />
                </button>
              </div>
            ) : (
              // Expanded state: Full menu content
              <div className="flex flex-col gap-2 h-full">
                 {/* New Chat Button (in expanded state) */}
                <button
                  onClick={handleNewChat}
                  className="w-full mb-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-3 px-4 rounded-lg flex items-center gap-2 font-medium"
                >
                  <FiEdit size={20} className="flex-shrink-0" />
                  <span className="overflow-hidden whitespace-nowrap">{t('newChat')}</span>
                </button>

                {/* Previous Chats Section (full list when expanded) */}
                <div className="mb-4 flex-1">
                  <button
                    onClick={() => setIsChatHistoryExpanded(!isChatHistoryExpanded)}
                    className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <FiFolder size={18} className="flex-shrink-0" />
                      <span className="overflow-hidden whitespace-nowrap">{t('previousChats')}</span>
                    </span>
                    <span>
                      {isChatHistoryExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </span>
                  </button>
                  {isChatHistoryExpanded && (
                    <div className="max-h-64 overflow-y-auto mt-2 pr-2 custom-scrollbar">
                      {allChatsSorted.length > 0 ? (
                        allChatsSorted.map(chat => {
                          const isWorkspace = chat.type === 'workspace';
                          const workspaceColorClass = isWorkspace ? getWorkspaceColorClass(chat.title, theme) : '';
                          
                          const itemClass = `mb-2 group relative p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                            ${isWorkspace ? workspaceColorClass : (chat.id === activeChatId ? 'bg-indigo-100 dark:bg-indigo-700' : 'bg-gray-100 dark:bg-gray-700')}`;

                          return (
                            <div
                              key={chat.id}
                              className={itemClass}
                              onClick={() => { setActiveChatId(chat.id); setIsSidebarExpanded(false); }}
                            >
                              <div className="flex justify-between items-center">
                                {renamingChat === chat.id ? (
                                  <input
                                    type="text"
                                    className="text-black dark:text-white rounded px-2 py-1 bg-white dark:bg-gray-600 w-full text-sm"
                                    defaultValue={chat.title}
                                    onBlur={(e) => handleRename(chat.id, e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleRename(chat.id, e.target.value); }}
                                    autoFocus
                                  />
                                ) : (
                                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                                )}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    ref={el => chatMenuButtonRefs.current[chat.id] = el}
                                    onClick={(e) => handleToggleChatMenu(e, chat.id)}
                                    className="p-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full"
                                    title={t('moreOptions')}
                                  >
                                    <FiMoreVertical size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">{t('noPreviousChats')}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Create Workspace Button (in expanded state) */}
                <button
                  onClick={() => { setShowWorkspaceModal(true); setIsSidebarExpanded(false); }}
                  className={`w-full mb-3 py-2 px-4 rounded-lg flex items-center gap-2 font-medium transition-colors
                    ${showWorkspaceModal ? 'bg-blue-700 text-white shadow-lg' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <FiFolder size={18} className="flex-shrink-0" />
                  <span className="overflow-hidden whitespace-nowrap">{t('createWorkspace')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Section (Settings icon always visible) */}
          <div className="mt-auto py-2">
            <button
              ref={settingsButtonRef}
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <FiSettings size={20} className="flex-shrink-0" />
              {isSidebarExpanded && ( // Only show text when expanded
                <span className="overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out w-auto">{t('settings')}</span>
              )}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="settings-menu-container absolute bg-white text-black dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-xl z-20 w-60 border border-gray-200 dark:border-gray-700"
               style={{
                 bottom: '1rem', // Position above the settings button
                 left: isSidebarExpanded ? '18rem' : '4rem', // Adjust based on sidebar width
                 transform: 'translateX(-50%)' // Center horizontally relative to its left point
               }}>
            <h2 className="text-lg font-semibold mb-3">{t('settings')}</h2>
            <button onClick={clearHistory} className="w-full mb-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors text-sm">{t('clearHistory')}</button>

            {/* Connect Apps Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold mb-2">{t('connectApps')}</h3>
              <a
                href="https://github.com/your-github-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm mb-2"
              >
                <FiGithub size={16} /> {t('github')}
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm mb-2"
              >
                <FiPhoneCall size={16} /> {t('whatsapp')}
              </a>
              <a
                href="mailto:your.email@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm mb-2"
              >
                <FiMail size={16} /> {t('gmail')}
              </a>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-3 bg-gray-200 dark:bg-gray-700 text-red-600 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FiLogOut size={16} /> {t('logout')}
            </button>
          </div>
        )}

        {/* Resizable handle */}
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
          style={{ zIndex: 30 }}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 p-10 flex flex-col bg-gray-50 dark:bg-gray-900 relative">

        {/* Profile Icon and Details - Adjusted positioning */}
        <div className="absolute top-4 right-4 z-40" ref={profileMenuRef}>
          <button
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            title={t('userProfile')}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <FiUser size={20} className="text-indigo-600 dark:text-indigo-400" />
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-base">{profileUserName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileUserEmail}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          {chats.find(chat => chat.id === activeChatId)?.messages.length > 0 ? (
            chats.find(chat => chat.id === activeChatId)?.messages.map((msg, index) => (
              <div key={index} className={`mb-4 p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-50 dark:bg-gray-700 ml-auto' : 'bg-green-50 dark:bg-gray-700 mr-auto'} max-w-3/4 shadow-sm`}>
                <span className={`font-semibold ${msg.role === 'user' ? 'text-indigo-700 dark:text-indigo-400' : 'text-green-700 dark:text-green-400'} block mb-1`}>
                  {msg.role === 'user' ? t('you') : t('synapseAI')}
                </span>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FiMessageSquare size={50} className="mb-4 text-indigo-400" />
              <p className="text-lg">{t('startNewConversation')}</p>
              <p className="text-sm">{t('typeMessageToBegin')}</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex flex-col gap-2">
            {selectedMode && (
                <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full w-fit mx-auto shadow-md">
                    {selectedMode === 'image' && <FiImage className="mr-2" size={16} />}
                    {selectedMode === 'document' && <FiFileText className="mr-2" size={16} />}
                    {selectedMode === 'video' && <FiVideo className="mr-2" size={16} />}
                    <span className="font-medium">{t(selectedMode + 'Mode')}</span>
                    <button
                        onClick={handleRemoveMode}
                        className="ml-2 p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                        title={t('clearSelection')}
                    >
                        <FiX size={14} />
                    </button>
                </div>
            )}
            <div className="flex gap-3 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-xl p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={t('uploaded')}
                >
                    <FiUpload />
                </label>

                <div className="relative">
                    <button
                        ref={modeSelectorButtonRef}
                        onClick={toggleModeSelector}
                        className="text-xl p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={t('selectMode')}
                    >
                        <FiImage />
                    </button>
                    {showModeSelectorOptions && (
                        <div
                            ref={modeSelectorOptionsRef}
                            className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-40 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => handleModeSelect('image')}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FiImage size={16} /> {t('imageMode')}
                            </button>
                            <button
                                onClick={() => handleModeSelect('document')}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FiFileText size={16} /> {t('documentMode')}
                            </button>
                            <button
                                onClick={() => handleModeSelect('video')}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FiVideo size={16} /> {t('videoMode')}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleVoiceInput}
                    className="text-xl p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={t('speechNotSupported')}
                >
                    <FiMic />
                </button>
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    placeholder={t('typeAMessage')}
                    className="flex-1 p-3 rounded-lg bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleSend}
                    className="bg-green-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                    {t('send')}
                </button>
            </div>
        </div>
      </div>

      {showWorkspaceModal && (
        <WorkspaceModal
          t={t}
          newWorkspace={newWorkspace}
          setNewWorkspace={setNewWorkspace}
          setShowWorkspaceModal={setShowWorkspaceModal}
          handleCreateWorkspace={handleCreateWorkspace}
        />
      )}

      {chatMenuOpenForId && (
        <ChatOptionsMenu
          chatId={chatMenuOpenForId}
          position={chatMenuPosition}
          onClose={() => setChatMenuOpenForId(null)}
          t={t}
          setRenamingChat={setRenamingChat}
          handleDelete={handleDelete}
          handleShare={handleShare}
          handlePin={handlePin}
          chatOptionsMenuRef={chatOptionsMenuRef}
          handleFeedback={handleFeedback}
        />
      )}
    </div>
  );
};

export default Dashboard;