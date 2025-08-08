import React, { useState } from 'react';
import { FiFileText, FiFileImage, FiFile, FiTrash2 } from 'react-icons/fi';

const Media = () => {
  const [uploads, setUploads] = useState([]);
  const [filter, setFilter] = useState('All');

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => {
      const type = file.type;
      const category = type.startsWith('image') ? 'Image' :
                      type.startsWith('video') ? 'Video' :
                      type.startsWith('audio') ? 'Audio' :
                      type === 'application/pdf' || type.startsWith('text') ? 'Document' :
                      'Other';

      return {
        name: file.name,
        type: type,
        category: category,
        url: URL.createObjectURL(file)
      };
    });
    setUploads([...uploads, ...newFiles]);
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Image':
        return <FiFileImage className="text-blue-400" />;
      case 'Document':
        return <FiFileText className="text-green-400" />;
      default:
        return <FiFile className="text-gray-400" />;
    }
  };

  const handleDelete = (index) => {
    const updated = [...uploads];
    updated.splice(index, 1);
    setUploads(updated);
  };

  const filteredUploads = filter === 'All'
    ? uploads
    : uploads.filter(file => file.category === filter);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Uploads</h1>
        <label className="bg-blue-600 px-4 py-2 rounded cursor-pointer">
          Upload
          <input type="file" multiple className="hidden" onChange={handleUpload} />
        </label>
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
        {filteredUploads.map((file, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded shadow flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2 items-center">
                {getIcon(file.category)}
                <p className="font-semibold">{file.name}</p>
              </div>
              <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600">
                <FiTrash2 />
              </button>
            </div>
            {/* Preview */}
            {file.category === 'Image' ? (
              <img src={file.url} alt={file.name} className="rounded mt-2 max-h-40 object-cover" />
            ) : (
              <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 underline mt-2">
                View File
              </a>
            )}
          </div>
        ))}
        {filteredUploads.length === 0 && (
          <p className="text-gray-400">No {filter.toLowerCase()} media available.</p>
        )}
      </div>
    </div>
  );
};

export default Media;
