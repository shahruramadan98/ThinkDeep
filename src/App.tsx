import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import type { ChatMessage } from './api/webhook';
import { sendChatMessage } from './api/webhook';

interface Document {
  id: string;
  name: string;
  messages: ChatMessage[];
}

/**
 * Main App Component
 * NotebookLLM-style interface with left panel (file upload) and right panel (chat)
 */
function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - File Upload & Sidebar */}
      <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
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
          <FileUploader onUploadSuccess={handleUploadSuccess} />
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
                  onClick={() => setActiveDocumentId(doc.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${activeDocumentId === doc.id
                    ? 'bg-white border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
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

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-200 p-4 bg-white flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeDocument ? activeDocument.name : 'Chat'}
          </h2>
          {!activeDocument && (
            <span className="text-sm text-amber-600 flex items-center gap-2">
              ⚠️ Upload a document to start
            </span>
          )}
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
