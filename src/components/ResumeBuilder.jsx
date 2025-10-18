import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBuilder = ({ isOpen, onClose }) => {
    const [pickedFile, setPickedFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    // n8n configuration
    const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://sandeep-synapse.app.n8n.cloud/webhook/ats-resume";
    const WEBHOOK_TOKEN = import.meta.env.VITE_N8N_WEBHOOK_TOKEN || "ats_prod_afee4e15d77fbc7b5541c1ddb7fd6fe50c81934875a287c6e11804eaa10fbaf3";

    const setStatusMessage = (html, className = "") => {
        setStatus({ html, className });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0] || null;
        setPickedFile(file);
        setStatusMessage("");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current?.classList.add("dragover");
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current?.classList.remove("dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current?.classList.remove("dragover");
        
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            fileInputRef.current.files = e.dataTransfer.files;
            setPickedFile(file);
            setStatusMessage("");
        }
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setPickedFile(null);
        setStatusMessage('<span class="text-gray-400">Cleared.</span>');
    };

    const getFilenameFromCD = (cd) => {
        if (!cd) return null;
        const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(cd);
        if (!match) return null;
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return match[1];
        }
    };

    const handleSubmit = async () => {
        setStatusMessage("");
        
        if (!pickedFile) {
            setStatusMessage("Please choose a PDF first.", "text-red-400");
            return;
        }
        
        if (pickedFile.type !== "application/pdf") {
            setStatusMessage("Only PDF files are allowed.", "text-red-400");
            return;
        }
        
        if (pickedFile.size > 10 * 1024 * 1024) {
            setStatusMessage("File is too large (max 10 MB).", "text-red-400");
            return;
        }

        setIsUploading(true);
        setStatusMessage('<span class="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>Uploading…');

        try {
            const form = new FormData();
            form.append("resume", pickedFile, pickedFile.name);

            const headers = {};
            if (WEBHOOK_TOKEN) {
                headers["X-Webhook-Token"] = WEBHOOK_TOKEN.trim();
            }

            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                body: form,
                headers,
                mode: "cors",
                credentials: "omit",
            });

            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`Server responded ${response.status}: ${text.slice(0, 300)}`);
            }

            const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
            if (!contentType.includes("application/pdf")) {
                const text = await response.text().catch(() => "");
                throw new Error("Server did not return a PDF. " + text.slice(0, 500));
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = getFilenameFromCD(response.headers.get("Content-Disposition")) || "resume.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            setStatusMessage("Resume built successfully. Your PDF is downloading.", "text-green-400");
        } catch (error) {
            console.error(error);
            setStatusMessage("Upload failed: " + (error.message || error), "text-red-400");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-lg bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Resume Builder</h2>
                                <p className="text-sm text-gray-400 mt-1">Upload your PDF and get an ATS-optimized resume</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* File Upload Area */}
                        <div
                            ref={dropRef}
                            className="flex items-center justify-center gap-3 h-14 px-4 rounded-xl border border-gray-600/50 bg-gradient-to-b from-gray-700/50 to-gray-800/50 text-gray-300 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 hover:bg-gray-700/70"
                            onDragEnter={handleDragOver}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gray-400">
                                <path d="M12 16V8m0 0-3 3m3-3 3 3M5 20h14a3 3 0 0 0 3-3v0a3 3 0 0 0-3-3h-1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                                {pickedFile ? pickedFile.name : "Upload PDF"}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Only PDF. Max 10 MB.</div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleClear}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-transparent border border-gray-600/50 text-gray-300 hover:border-gray-500 transition-all duration-200"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!pickedFile || isUploading}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                    !pickedFile || isUploading
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                }`}
                            >
                                {isUploading ? 'Processing...' : 'Submit'}
                            </button>
                        </div>

                        {/* Status */}
                        {status && (
                            <div className={`mt-4 text-sm ${status.className}`}>
                                <div dangerouslySetInnerHTML={{ __html: status.html }} />
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResumeBuilder;
