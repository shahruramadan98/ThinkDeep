import React, { useState, type ChangeEvent } from 'react';
import { uploadFile } from '../api/webhook';

interface FileUploaderProps {
    onUploadSuccess: (fileName: string) => void;
    variant?: 'sidebar' | 'landing';
}

/**
 * FileUploader Component
 * Handles PDF file upload to the RAG workflow
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, variant = 'sidebar' }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset error
        setError(null);

        // Validate file type
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported');
            e.target.value = ''; // Reset input
            return;
        }

        setUploading(true);

        try {
            await uploadFile(file);
            onUploadSuccess(file.name);
            e.target.value = ''; // Reset input for next upload
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    if (variant === 'landing') {
        return (
            <div className="w-full max-w-xl mx-auto">
                <div className="mb-4">
                    <label
                        htmlFor="file-upload-landing"
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploading
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50 hover:shadow-md'
                            }`}
                    >
                        <div className="text-center p-6">
                            <svg
                                className={`mx-auto h-12 w-12 mb-3 ${uploading ? 'text-gray-400' : 'text-purple-500'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-lg font-medium text-gray-700">
                                {uploading ? 'Uploading...' : 'Upload Document'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Drag & drop or click to browse</p>
                            <p className="text-xs text-gray-400 mt-1">Supported PDF only</p>
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

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Document Upload</h2>

            {/* Upload Button */}
            <div className="mb-4">
                <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto h-8 w-8 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-sm text-gray-600">
                            {uploading ? 'Uploading...' : 'Click to upload PDF'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF files only</p>
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
