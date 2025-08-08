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

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (msgText) => {
    if (msgText.trim()) {
      const newMessages = [...messages, { text: msgText, sender: 'User' }];
      setMessages(newMessages);

      setTimeout(() => {
        const botResponse = {
          text: 'This is a simulated AI response to: ' + msgText,
          sender: 'Synapse AI'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleVoiceInput = (voiceText) => {
    sendMessage(voiceText);
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
            <span><strong>{msg.sender}:</strong> {msg.text}</span>
          </motion.div>
        ))}
      </div>
      <ChatInput sendMessage={sendMessage} handleVoiceInput={handleVoiceInput} darkMode={darkMode} />
    </div>
  );
};

export default ChatUI;
