// src/pages/Main.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      //style={{ backgroundImage: "url('/synapse-bg.png')" }}
    >
      {/* Dark overlay for better button contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Buttons */}
      <div className="absolute top-0 right-0 m-6 flex gap-4 z-10">
        <button
          onClick={() => navigate("/login")}
          className="bg-transparent border border-white px-4 py-2 rounded text-white hover:bg-white hover:text-black transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Main;
