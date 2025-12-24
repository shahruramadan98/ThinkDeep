import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import type { ChatMessage } from './api/webhook';
import { sendChatMessage } from './api/webhook';

/**
 * Main App Component
 * NotebookLLM-style interface with left panel (file upload) and right panel (chat)
 */
function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  /**
   * Handle successful file upload
   */
  const handleUploadSuccess = (fileName: string) => {
    setHasUploadedFile(true);
    // Add system message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Document "${fileName}" has been successfully indexed. You can now ask questions about it.`,
      },
    ]);
  };

  /**
   * Handle sending chat message
   */
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Send message to webhook
      const answer = await sendChatMessage(message);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - File Upload */}
      <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">RAG ThinkDeep</h1>
          <p className="text-sm text-gray-600">Upload documents and ask questions</p>
        </div>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-200 p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
          {!hasUploadedFile && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Please upload a document to start chatting
            </p>
          )}
        </div>
        <ChatWindow messages={messages} loading={loading} />
        <ChatInput
          onSend={handleSendMessage}
          disabled={!hasUploadedFile}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
