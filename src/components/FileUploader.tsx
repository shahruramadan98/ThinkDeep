import React, { useState, type ChangeEvent } from 'react'
import { uploadFile } from '../api/webhook'

interface FileUploaderProps {
    onUploadSuccess: (fileName: string) => void
    variant?: 'sidebar' | 'landing'
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onUploadSuccess,
    variant = 'sidebar'
}) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported')
            e.target.value = ''
            return
        }

        setUploading(true)

        try {
            await uploadFile(file)
            onUploadSuccess(file.name)
            e.target.value = ''
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file')
        } finally {
            setUploading(false)
        }
    }

    if (variant === 'landing') {
        return (
            <div className="w-full max-w-xl mx-auto">
                <label
                    htmlFor="file-upload-landing"
                    className={`
            flex flex-col items-center justify-center w-full h-56
            rounded-3xl cursor-pointer transition-all duration-300
            border border-white/60 backdrop-blur-xl
            ${uploading
                            ? 'bg-white/40 opacity-60 cursor-not-allowed'
                            : 'bg-white/60 hover:bg-white/70 hover:shadow-xl'
                        }
          `}
                >
                    <div className="text-center px-6">
                        {uploading ? (
                            <svg
                                className="animate-spin h-10 w-10 text-sky-400 mx-auto mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                        ) : (
                            <div className="bg-sky-200/70 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                                <svg
                                    className="h-8 w-8 text-sky-600"
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
                            </div>
                        )}

                        <p className="text-lg font-semibold text-slate-800">
                            {uploading ? 'Processing PDF' : 'Upload your document'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                            Drag and drop or click to browse
                        </p>
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

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-100/70 border border-red-200 text-center">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <label
                htmlFor="file-upload"
                className={`
          flex flex-col items-center justify-center w-full px-4 py-6
          rounded-xl cursor-pointer transition-all duration-200
          border border-white/60 backdrop-blur-xl
          ${uploading
                        ? 'bg-white/40 cursor-not-allowed'
                        : 'bg-white/60 hover:bg-white/70'
                    }
        `}
            >
                <div className="text-center">
                    {uploading ? (
                        <svg
                            className="animate-spin h-6 w-6 text-sky-400 mx-auto mb-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="mx-auto h-8 w-8 text-slate-500 mb-2"
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
                    )}
                    <p className="text-xs font-medium text-slate-600">
                        {uploading ? 'Uploading' : 'Upload PDF'}
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

            {error && (
                <div className="mt-3 p-2 rounded-lg bg-red-100/70 border border-red-200">
                    <p className="text-xs text-red-600 text-center">{error}</p>
                </div>
            )}
        </div>
    )
}

export default FileUploader
