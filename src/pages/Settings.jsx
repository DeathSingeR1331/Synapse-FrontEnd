import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBell, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user, apiCall, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ full_name: '', pfpb: '' });
    const [notifications, setNotifications] = useState({ email_enabled: true, push_enabled: true, in_app_enabled: true });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setProfile({ full_name: user.full_name || '', pfpb: user.pfpb || '' });
            if (user.notification_preferences) {
                setNotifications(user.notification_preferences);
            }
            setIsLoading(false);
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const handleProfileSave = async () => {
        const toastId = toast.loading("Saving profile...");
        try {
            const response = await apiCall('/api/v1/users/me', {
                method: 'PATCH',
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error("Failed to save profile.");
            await fetchUser(); // Re-fetch user context to get updated data
            toast.update(toastId, { render: "Profile saved successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleNotificationsSave = async () => {
        const toastId = toast.loading("Saving preferences...");
        try {
            const response = await apiCall('/api/v1/users/me/notifications', {
                method: 'PATCH',
                body: JSON.stringify(notifications),
            });
            if (!response.ok) throw new Error("Failed to save preferences.");
            await fetchUser();
            toast.update(toastId, { render: "Preferences saved!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    if (isLoading) return <div>Loading settings...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-8 text-cyan-400 hover:text-cyan-300">
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <h1 className="text-4xl font-bold mb-10 text-white">Settings</h1>

                {/* Profile Settings */}
                <div className="bg-gray-800/50 p-8 rounded-lg mb-8 border border-gray-700/50">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiUser /> Profile Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-400">Full Name</label>
                            <input type="text" name="full_name" id="full_name" value={profile.full_name} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="pfpb" className="block text-sm font-medium text-gray-400">Profile Picture URL</label>
                            <input type="text" name="pfpb" id="pfpb" value={profile.pfpb} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                    </div>
                    <div className="text-right mt-6">
                        <button onClick={handleProfileSave} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700">
                            <FiSave className="mr-2" /> Save Profile
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700/50">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiBell /> Notification Preferences</h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-300">Enable Email Notifications</span>
                            <input type="checkbox" name="email_enabled" checked={notifications.email_enabled} onChange={handleNotificationChange} className="form-checkbox h-5 w-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500" />
                        </label>
                         <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-300">Enable Push Notifications</span>
                            <input type="checkbox" name="push_enabled" checked={notifications.push_enabled} onChange={handleNotificationChange} className="form-checkbox h-5 w-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500" />
                        </label>
                    </div>
                     <div className="text-right mt-6">
                        <button onClick={handleNotificationsSave} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700">
                           <FiSave className="mr-2" /> Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;