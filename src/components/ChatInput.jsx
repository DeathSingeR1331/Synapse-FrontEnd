import React, { useState, useRef } from 'react';
import { FaMicrophone, FaPaperPlane, FaUpload, FaFileAlt, FaImage, FaVideo } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const ChatInput = ({ sendMessage, handleVoiceInput, darkMode }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState(null);
  const fileInputRef = useRef(null);
  const mediaTypes = ['image', 'video', 'document'];

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
      setMode(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleVoiceClick = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      handleVoiceInput(voiceText);
    };
    recognition.start();
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode === mode ? null : selectedMode);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendMessage(`[${mode.toUpperCase()} UPLOADED] ${file.name}`);
      setMode(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <button onClick={() => handleModeChange('document')} className={`p-2 rounded ${mode === 'document' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} title="Select Document">
          <FaFileAlt />
        </button>
        <button onClick={() => handleModeChange('image')} className={`p-2 rounded ${mode === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} title="Select Image">
          <FaImage />
        </button>
        <button onClick={() => handleModeChange('video')} className={`p-2 rounded ${mode === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} title="Select Video">
          <FaVideo />
        </button>
        <button onClick={handleVoiceClick} className="p-2 rounded bg-gray-200 dark:bg-gray-700" title="Voice Input">
          <FaMicrophone />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={mode === 'image' ? 'image/*' : mode === 'video' ? 'video/*' : '*'}
          className="hidden"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={!mode}
          className={`p-2 bg-green-600 text-white rounded ${!mode ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaUpload />
        </motion.button>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-grow p-2 rounded text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Type your message${mode ? ` with ${mode}` : ''}...`}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 px-4 py-2 rounded text-white"
          onClick={handleSend}
        >
          <FaPaperPlane />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;