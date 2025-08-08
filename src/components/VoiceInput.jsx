import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Your browser does not support Speech Recognition.');
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      setError('Error occurred in recognition: ' + e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (onVoiceInput) onVoiceInput(transcript);
    };

    recognition.start();
  };

  return (
    <div className="mt-4 text-center">
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={startListening}
        className={`px-6 py-2 rounded text-white ${isListening ? 'bg-red-600' : 'bg-purple-600'}`}
      >
        🎙 {isListening ? 'Listening...' : 'Start Voice Input'}
      </button>
    </div>
  );
};

export default VoiceInput;
