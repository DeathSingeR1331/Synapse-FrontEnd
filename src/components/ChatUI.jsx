import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import ChatInput from './ChatInput';

const ChatUI = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(true);
  const [chatMode, setChatMode] = useState('personalization'); // 'personalization' | 'tools' | 'both'

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (msgText) => {
    if (msgText.trim()) {
      const newMessages = [...messages, {
        text: msgText,
        sender: 'User',
        mode: chatMode
      }];
      setMessages(newMessages);

      setTimeout(() => {
        const botResponse = {
          text: `[${chatMode.toUpperCase()} MODE] This is a simulated AI response to: ${msgText}`,
          sender: 'Synapse AI',
          mode: chatMode
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleVoiceInput = (voiceText) => {
    sendMessage(voiceText);
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'personalization':
        return '💡 I\'ll remember our conversation and learn from it';
      case 'tools':
        return '⚡ I\'ll execute tools immediately without memory';
      case 'both':
        return '🌟 I\'ll use tools with conversation context';
      default:
        return '';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'personalization':
        return '🧠';
      case 'tools':
        return '🔧';
      case 'both':
        return '🚀';
      default:
        return '';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg w-full max-w-4xl mx-auto`}>
      <div className={`flex justify-between items-center mb-3`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Chat with Synapse AI</h2>
        <button
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Mode Selector */}
      <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className="flex items-center gap-3 mb-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Chat Mode:
          </label>
          <select
            value={chatMode}
            onChange={(e) => setChatMode(e.target.value)}
            className={`px-3 py-1 rounded text-sm border ${darkMode
                ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-white text-gray-700 border-gray-300'
              }`}
          >
            <option value="personalization">🧠 Personalization (Memory & Learning)</option>
            <option value="tools">🔧 Tools (Real-time Actions)</option>
            <option value="both">🚀 Both (Advanced)</option>
          </select>
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {getModeDescription(chatMode)}
        </div>
      </div>
      <div className={`h-64 overflow-y-auto p-4 rounded mb-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`mb-2 flex items-center gap-2`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={msg.sender === 'User'
                ? 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'
                : 'https://ui-avatars.com/api/?name=SynapseAI&background=6A0DAD&color=fff'}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span><strong>{msg.sender}:</strong></span>
                {msg.mode && (
                  <span className={`text-xs px-2 py-1 rounded ${msg.mode === 'personalization' ? 'bg-purple-100 text-purple-800' :
                      msg.mode === 'tools' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {getModeIcon(msg.mode)} {msg.mode}
                  </span>
                )}
              </div>
              <span>{msg.text}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <ChatInput sendMessage={sendMessage} handleVoiceInput={handleVoiceInput} darkMode={darkMode} chatMode={chatMode} />
    </div>
  );
};

export default ChatUI;
