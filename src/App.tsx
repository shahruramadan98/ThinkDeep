import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import type { ChatMessage } from './api/webhook';
import { sendChatMessage } from './api/webhook';
import type { Document } from './types';

/**
 * Main App Component
 * THEME MATCHED: Dark/Glass Landing Page AND Dark Main Interface
 */
function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeDocument = documents.find((doc) => doc.id === activeDocumentId);
  const currentMessages = activeDocument?.messages || [];

  /**
   * Handle successful file upload
   */
  const handleUploadSuccess = (fileName: string) => {
    const newDocId = crypto.randomUUID();
    const newDoc: Document = {
      id: newDocId,
      name: fileName,
      messages: [
        {
          role: 'assistant',
          content: `Document "${fileName}" has been successfully indexed. You can now ask questions about it.`,
        },
      ],
    };

    setDocuments((prev) => [...prev, newDoc]);
    setActiveDocumentId(newDocId);
    setIsSidebarOpen(false);
  };

  /**
   * Handle sending chat message
   */
  const handleSendMessage = async (message: string) => {
    if (!activeDocumentId) return;

    const userMessage: ChatMessage = { role: 'user', content: message };

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === activeDocumentId
          ? { ...doc, messages: [...doc.messages, userMessage] }
          : doc
      )
    );

    setLoading(true);

    try {
      const answer = await sendChatMessage(message);
      const assistantMessage: ChatMessage = { role: 'assistant', content: answer };

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeDocumentId
            ? { ...doc, messages: [...doc.messages, assistantMessage] }
            : doc
        )
      );
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      };

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeDocumentId
            ? { ...doc, messages: [...doc.messages, errorMessage] }
            : doc
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // STATE 1: Landing Page (Glassmorphism Style)
  // ---------------------------------------------------------------------------
  if (documents.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">

        {/* Decorative Background Blobs for Glass Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />

        <div className="w-full max-w-xl flex flex-col items-center relative z-10">

          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 animate-fade-in-down">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
              <img
                src="/ThinkDeepLogo.png"
                alt="ThinkDeep Logo"
                className="w-10 h-10 rounded-md"
              />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
              ThinkDeep
            </span>
          </div>

          {/* Glass Card Container */}
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 text-center transition-transform duration-300 hover:scale-[1.01]">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Unlock insights from your docs
            </h1>
            <p className="text-lg text-blue-100/80 mb-10 max-w-sm mx-auto leading-relaxed">
              Upload a PDF to start asking questions, summarizing content, and analyzing key insights instantly.
            </p>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
                <FileUploader
                  onUploadSuccess={handleUploadSuccess}
                  variant="landing"
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-white/40 font-medium">
            Powered by RAG ThinkDeep 1.0
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: Main App (Sidebar + Chat) - UPDATED TO DARK MODE
  // ---------------------------------------------------------------------------
  return (
    // Changed bg-gray-50 to bg-slate-950
    <div className="flex h-screen bg-slate-950 relative overflow-hidden">

      {/* Mobile Header (Dark Glass) */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-white">ThinkDeep</span>
      </div>

      <Sidebar
        documents={documents}
        activeDocumentId={activeDocumentId}
        onSelectDocument={setActiveDocumentId}
        onUploadSuccess={handleUploadSuccess}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Right Panel - Chat Interface Wrapper */}
      {/* Changed bg-white to bg-slate-950 and border colors */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden shadow-2xl m-0 md:m-3 md:rounded-2xl border-0 md:border border-white/10 mt-16 md:mt-0 pt-0 relative z-10">

        {/* Chat Header */}
        <div className="border-b border-white/10 p-4 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center z-10 sticky top-0">
          <h2 className="text-lg font-semibold text-white truncate pr-4 flex items-center gap-2">
            {activeDocument ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
                {activeDocument.name}
              </>
            ) : 'Chat'}
          </h2>
        </div>

        {activeDocument ? (
          <>
            <ChatWindow messages={currentMessages} loading={loading} />
            <ChatInput
              onSend={handleSendMessage}
              disabled={false}
              loading={loading}
              activeDocument={activeDocument.name}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500 flex-col gap-4">
            {/* Empty Chat State */}
            <div className="p-6 bg-white/5 rounded-full shadow-inner border border-white/5">
              <svg className="w-12 h-12 opacity-50 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>Select a document from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;