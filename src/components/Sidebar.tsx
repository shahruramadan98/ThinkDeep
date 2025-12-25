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
 * THEME MATCHED: Uses Slate-900 to Indigo-950 gradients and Purple accents
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
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-80 
          /* THEME MATCH: Deep gradient background instead of flat gray */
          bg-gradient-to-b from-slate-900 via-[#0f172a] to-indigo-950
          border-r border-white/10 
          flex flex-col text-white
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-6 pb-4">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            {/* Logo Container - Glass Style */}
                            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 shadow-inner">
                                <img
                                    src="/ThinkDeepLogo.png"
                                    alt="ThinkDeep Logo"
                                    className="w-8 h-8 rounded"
                                />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                ThinkDeep
                            </h1>
                        </div>
                        <p className="text-xs font-medium text-indigo-200/50 pl-1">
                            AI-Powered Research Workspace
                        </p>
                    </div>

                    {/* Uploader Wrapper */}
                    <div className="relative group">
                        {/* THEME MATCH: Purple/Blue glow matching the landing page blobs */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
                            <FileUploader onUploadSuccess={onUploadSuccess} />
                        </div>
                    </div>
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                    {documents.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 mt-4">
                                Your Documents
                            </h3>

                            {documents.map((doc) => {
                                const isActive = activeDocumentId === doc.id;

                                return (
                                    <button
                                        key={doc.id}
                                        onClick={() => {
                                            onSelectDocument(doc.id);
                                            onClose();
                                        }}
                                        className={`
                      w-full text-left p-3 rounded-xl text-sm transition-all duration-200 
                      flex items-center gap-3 border relative overflow-hidden group
                      ${isActive
                                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.15)]' // Active: Indigo Glow
                                                : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200' // Inactive
                                            }
                    `}
                                    >
                                        {/* Active Indicator Line */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>
                                        )}

                                        <svg
                                            className={`h-5 w-5 flex-shrink-0 transition-colors ml-1 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="truncate font-medium">{doc.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Profile */}
                <div className="p-4 border-t border-white/5 bg-black/10">
                    <button className="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-indigo-900 group-hover:ring-indigo-700 transition-all">
                            TD
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors">Free Plan</span>
                            <span className="text-[10px] text-slate-500">View Settings</span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;