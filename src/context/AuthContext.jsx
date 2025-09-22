// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = '';

    const logout = useCallback(async () => {
        setUser(null);
        setAccessToken(null);
        try {
            await fetch(`/api/v1/logout`, { method: 'POST', credentials: 'include' });
        } catch (error) {
            console.error("Logout request failed:", error);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        const userResponse = await fetch(`/api/v1/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userData = await userResponse.json();
        setUser(userData);
    };

    const apiCall = useCallback(async (url, options = {}) => {
        let token = accessToken;

        const performFetch = async (currentToken) => {
            const fetchOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            };
            return await fetch(`${API_BASE}${url}`, fetchOptions);
        };

        let response = await performFetch(token);

        if (response.status === 401) {
            try {
                const refreshResponse = await fetch(`/api/v1/refresh`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!refreshResponse.ok) throw new Error("Refresh token invalid or expired");

                const newTokens = await refreshResponse.json();
                setAccessToken(newTokens.access_token);
                
                response = await performFetch(newTokens.access_token);
            } catch (e) {
                await logout();
                throw e;
            }
        }
        
        return response;

    }, [accessToken, logout]);


    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const refreshResponse = await fetch(`/api/v1/refresh`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (refreshResponse.ok) {
                    const newTokens = await refreshResponse.json();
                    setAccessToken(newTokens.access_token);
                    await fetchUserProfile(newTokens.access_token);
                } else {
                    setUser(null);
                    setAccessToken(null);
                }
            } catch (error) {
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [logout]);
    
    // --- THIS FUNCTION HAS BEEN REWRITTEN ---
    const emailLogin = async (credentials) => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);
            
            const response = await fetch(`/api/v1/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
                credentials: 'include' // Ensure cookies are handled
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Invalid credentials');
            }

            const tokens = await response.json();
            setAccessToken(tokens.access_token);
            await fetchUserProfile(tokens.access_token);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    
    const initiateGoogleAuth = () => {
        window.location.href = `/api/v1/google/login`; 
    };

    const completeGoogleProfile = async (completionToken, profileData) => {
        try {
            const response = await fetch(`/api/v1/complete-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${completionToken}`
                },
                body: JSON.stringify(profileData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Profile completion failed.');
            }

            const tokens = await response.json();
            setAccessToken(tokens.access_token);
            await fetchUserProfile(tokens.access_token);
            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    const register = async (userData) => { /* Your register logic here */ return { success: true } };

    const value = {
        user,
        loading,
        accessToken,
        isAuthenticated: !!user,
        apiCall,
        emailLogin,
        logout,
        initiateGoogleAuth,
        register, 
        completeGoogleProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};