// src/pages/Media.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// CHANGED: Replaced FiFileImage with the correct FiImage
import { FiFileText, FiImage, FiFile, FiTrash2 } from 'react-icons/fi';

const Media = () => {
  const navigate = useNavigate();
  // CHANGED: Removed apiCall and added API_BASE from context
  const { isAuthenticated, API_BASE } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);

    try {
      // This logic now uses a standard fetch call
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      // Example of uploading to a real backend
      /*
      const response = await fetch(`${API_BASE}/api/v1/media/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // This is crucial for cookie-based auth
        // Note: Do not set 'Content-Type' header here, the browser does it automatically for FormData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const uploadedFiles = await response.json();
      setUploads(prev => [...prev, ...uploadedFiles]);
      */

      // --- SIMULATED UPLOAD FOR DEMO ---
      // This part simulates a successful upload since there's no live backend
      const newFiles = files.map((file) => {
        const type = file.type;
        const category = type.startsWith('image') ? 'Image' :
                         type.startsWith('video') ? 'Video' :
                         type.startsWith('audio') ? 'Audio' :
                         type === 'application/pdf' || type.startsWith('text') ? 'Document' :
                         'Other';

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: type,
          category: category,
          url: URL.createObjectURL(file), // For local preview only
          size: file.size,
          uploadDate: new Date().toISOString()
        };
      });
      setUploads(prev => [...prev, ...newFiles]);
      // --- END SIMULATED UPLOAD ---

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Image':
        // CHANGED: Used the correct FiImage component
        return <FiImage className="text-blue-400" />;
      case 'Document':
        return <FiFileText className="text-green-400" />;
      default:
        return <FiFile className="text-gray-400" />;
    }
  };

  const handleDelete = async (id) => {
    try {
      // Example of calling backend to delete, now using fetch
      /*
      await fetch(`${API_BASE}/api/v1/media/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Crucial for cookie-based auth
      });
      */

      // For demonstration, we just filter the state
      const updated = uploads.filter(file => file.id !== id);
      setUploads(updated);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const filteredUploads = filter === 'All'
    ? uploads
    : uploads.filter(file => file.category === filter);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Uploads</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <label className={`px-4 py-2 rounded cursor-pointer transition-colors ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}>
            {loading ? 'Uploading...' : 'Upload'}
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {['All', 'Image', 'Video', 'Audio', 'Document'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1 rounded ${filter === cat ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUploads.map((file) => (
          <div key={file.id} className="bg-gray-800 p-4 rounded shadow flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2 items-center min-w-0">
                <div className="flex-shrink-0">{getIcon(file.category)}</div>
                <div className="flex flex-col min-w-0">
                  <p className="font-semibold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(file.id)} 
                className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
                title="Delete file"
              >
                <FiTrash2 />
              </button>
            </div>
            
            {/* Preview */}
            {file.category === 'Image' ? (
              <img 
                src={file.url} 
                alt={file.name} 
                className="rounded mt-2 max-h-40 object-cover w-full" 
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-700 rounded mt-2 h-40">
                <div className="text-center">
                  <div className="text-4xl">{getIcon(file.category)}</div>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-sm text-indigo-400 underline mt-2 block"
                  >
                    View File
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredUploads.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">
              {filter === 'All' ? 'No media files uploaded yet.' : `No ${filter.toLowerCase()} files available.`}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Upload some files to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;