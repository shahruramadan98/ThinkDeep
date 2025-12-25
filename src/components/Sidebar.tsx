import React from 'react';
import FileUploader from './FileUploader';
import type { Document } from '../types';

interface SidebarProps {
    documents: Document[];
    activeDocumentId: string | null;
    onSelectDocument: (id: string) => void;
    onUploadSuccess: (fileName: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Sidebar Component
 * Displays imported documents and file uploader
 * Responsive: Hidden on mobile by default, toggled via isOpen prop
 */
const Sidebar: React.FC<SidebarProps> = ({
    documents,
    activeDocumentId,
    onSelectDocument,
    onUploadSuccess,
    isOpen,
    onClose,
}) => {
    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-gray-50/50 border-r border-gray-100 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-6 pb-4">
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src="/ThinkDeepLogo.png"
                                alt="ThinkDeep Logo"
                                className="w-15 h-15 rounded-md"
                            />
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                ThinkDeep
                            </h1>
                        </div>
                        <p className="text-sm text-gray-600">Upload documents and ask questions</p>
                    </div>
                    <FileUploader onUploadSuccess={onUploadSuccess} />
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {documents.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                                Documents
                            </h3>
                            {documents.map((doc) => (
                                <button
                                    key={doc.id}
                                    onClick={() => {
                                        onSelectDocument(doc.id);
                                        onClose(); // Close sidebar on mobile selection
                                    }}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-center gap-3 ${activeDocumentId === doc.id
                                            ? 'bg-white border text-blue-700 shadow-sm ring-1 ring-blue-50 border-blue-100'
                                            : 'text-gray-600 hover:bg-white hover:shadow-sm border border-transparent'
                                        }`}
                                >
                                    <svg className={`h-5 w-5 flex-shrink-0 ${activeDocumentId === doc.id ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="truncate font-medium">{doc.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
