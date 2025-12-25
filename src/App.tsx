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
 * NotebookLLM-style interface with left panel (file upload) and right panel (chat)
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

    // Close sidebar on mobile after upload
    setIsSidebarOpen(false);
  };

  /**
   * Handle sending chat message
   */
  const handleSendMessage = async (message: string) => {
    if (!activeDocumentId) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    };

    // Optimistically update UI
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === activeDocumentId
          ? { ...doc, messages: [...doc.messages, userMessage] }
          : doc
      )
    );

    setLoading(true);

    try {
      // Send message to webhook
      const answer = await sendChatMessage(message);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer,
      };

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeDocumentId
            ? { ...doc, messages: [...doc.messages, assistantMessage] }
            : doc
        )
      );
    } catch (error) {
      // Add error message to chat
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

  // Empty State / Landing Page
  if (documents.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/ThinkDeepLogo.png"
              alt="ThinkDeep Logo"
              className="w-10 h-10 rounded-md shadow-sm"
            />
            <span className="text-xl font-bold text-gray-900">ThinkDeep</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center tracking-tight">
            What would you like to explore?
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-md">
            Upload a document to start asking questions, summarize content, and analyze key insights.
          </p>

          <FileUploader onUploadSuccess={handleUploadSuccess} variant="landing" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-gray-900">ThinkDeep</span>
      </div>

      <Sidebar
        documents={documents}
        activeDocumentId={activeDocumentId}
        onSelectDocument={setActiveDocumentId}
        onUploadSuccess={handleUploadSuccess}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-xl m-0 md:m-2 rounded-none md:rounded-2xl border-0 md:border border-gray-100 mt-16 md:mt-0 pt-0">
        <div className="border-b border-gray-100 p-4 bg-white/80 backdrop-blur-sm flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {activeDocument ? activeDocument.name : 'Chat'}
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
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 flex-col gap-4">
            <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Select or upload a document to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
