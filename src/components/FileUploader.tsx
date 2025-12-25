import React, { useState, type ChangeEvent } from 'react';
import { uploadFile } from '../api/webhook';

interface FileUploaderProps {
    onUploadSuccess: (fileName: string) => void;
    variant?: 'sidebar' | 'landing';
}

/**
 * FileUploader Component
 * THEME MATCHED: Dark Glass styling for both Landing and Sidebar variants
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, variant = 'sidebar' }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported');
            e.target.value = '';
            return;
        }

        setUploading(true);

        try {
            await uploadFile(file);
            onUploadSuccess(file.name);
            e.target.value = '';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    // -------------------------------------------------------------------------
    // VARIANT: LANDING PAGE (Large, Glassy, Centered)
    // -------------------------------------------------------------------------
    if (variant === 'landing') {
        return (
            <div className="w-full max-w-xl mx-auto">
                <div className="mb-4">
                    <label
                        htmlFor="file-upload-landing"
                        className={`
                            flex flex-col items-center justify-center w-full h-52 
                            border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group
                            ${uploading
                                ? 'border-white/10 bg-black/20 cursor-not-allowed opacity-50'
                                : 'border-white/20 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]'
                            }
                        `}
                    >
                        <div className="text-center p-6">
                            {uploading ? (
                                <svg className="animate-spin h-10 w-10 text-indigo-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <div className="bg-indigo-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-8 w-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                            )}

                            <p className="text-lg font-medium text-white group-hover:text-indigo-100 transition-colors">
                                {uploading ? 'Processing PDF...' : 'Upload Document'}
                            </p>
                            <p className="text-sm text-slate-400 mt-2">Drag & drop or click to browse</p>
                        </div>
                        <input
                            id="file-upload-landing"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center backdrop-blur-sm">
                        <p className="text-sm text-red-200 font-medium">{error}</p>
                    </div>
                )}
            </div>
        )
    }

    // -------------------------------------------------------------------------
    // VARIANT: SIDEBAR (Compact, Dark Slate)
    // -------------------------------------------------------------------------
    return (
        <div className="w-full">
            {/* Upload Button */}
            <div className="mb-0">
                <label
                    htmlFor="file-upload"
                    className={`
                        flex flex-col items-center justify-center w-full px-4 py-6 
                        border border-dashed rounded-xl cursor-pointer transition-all duration-200
                        ${uploading
                            ? 'border-white/5 bg-slate-900/50 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30'
                        }
                    `}
                >
                    <div className="text-center">
                        {uploading ? (
                            <svg className="animate-spin h-6 w-6 text-indigo-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="mx-auto h-8 w-8 text-slate-400 mb-2 transition-colors hover:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        )}
                        <p className="text-xs font-medium text-slate-300">
                            {uploading ? 'Uploading...' : 'Click to upload PDF'}
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Error Message - Sidebar Style */}
            {error && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-300 text-center">{error}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;