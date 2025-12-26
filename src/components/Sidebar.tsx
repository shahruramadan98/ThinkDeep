import React from 'react'
import FileUploader from './FileUploader'
import type { Document } from '../types'

interface SidebarProps {
    documents: Document[]
    activeDocumentId: string | null
    onSelectDocument: (id: string) => void
    onUploadSuccess: (fileName: string) => void
    isOpen: boolean
    onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
    documents,
    activeDocumentId,
    onSelectDocument,
    onUploadSuccess,
    isOpen,
    onClose
}) => {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-80
          bg-white/75 backdrop-blur-2xl
          border-r border-white/40
          flex flex-col text-slate-800
          transform transition-transform duration-300 ease-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-6 pb-4">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="relative p-2 rounded-xl bg-white/80 border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_rgba(0,0,0,0.08)]">
                                <img
                                    src="/ThinkDeepLogo.png"
                                    alt="ThinkDeep Logo"
                                    className="w-8 h-8 rounded-md"
                                />
                            </div>
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                                ThinkDeep
                            </h1>
                        </div>
                        <p className="text-xs font-medium text-slate-400 pl-1">
                            AI Powered Research Workspace
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-300/60 via-purple-300/60 to-fuchsia-300/60 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative bg-white/85 border border-white/70 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_12px_30px_rgba(168,85,247,0.18)]">
                            <FileUploader onUploadSuccess={onUploadSuccess} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {documents.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4 px-3">
                                Your Documents
                            </h3>

                            {documents.map(doc => {
                                const isActive = activeDocumentId === doc.id

                                return (
                                    <button
                                        key={doc.id}
                                        onClick={() => {
                                            onSelectDocument(doc.id)
                                            onClose()
                                        }}
                                        className={`
                      relative w-full text-left p-3.5 rounded-2xl text-sm
                      transition-all duration-300
                      flex items-center gap-3
                      ${isActive
                                                ? 'bg-white/60 text-slate-900 shadow-[0_10px_30px_rgba(168,85,247,0.28)]'
                                                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                                            }
                    `}
                                    >
                                        {isActive && (
                                            <>
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-200/60 via-violet-200/40 to-transparent pointer-events-none"></div>
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-400 to-violet-500 rounded-r-full shadow-[0_0_18px_rgba(168,85,247,0.9)]"></div>
                                            </>
                                        )}

                                        <svg
                                            className={`relative z-10 h-5 w-5 flex-shrink-0 ml-1 transition-colors ${isActive
                                                    ? 'text-purple-500'
                                                    : 'text-slate-400 group-hover:text-slate-600'
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>

                                        <span className="relative z-10 truncate font-medium">
                                            {doc.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/50 bg-white/60">
                    <button className="flex items-center gap-3 p-2.5 w-full rounded-xl hover:bg-white/70 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_8px_20px_rgba(168,85,247,0.35)] ring-2 ring-white">
                            TD
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-semibold text-slate-800">
                                Free Plan
                            </span>
                            <span className="text-[10px] text-slate-400">
                                View Settings
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar
