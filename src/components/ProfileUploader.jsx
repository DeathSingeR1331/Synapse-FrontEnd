import React, { useState } from 'react';

const ProfileUploader = () => {
  const [profilePic, setProfilePic] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <label className="cursor-pointer bg-blue-600 px-4 py-2 rounded text-white">
        Upload Profile Picture
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
      {profilePic && <img src={profilePic} alt="Profile" className="mt-4 w-24 h-24 rounded-full" />}
    </div>
  );
};

export default ProfileUploader;
