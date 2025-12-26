import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import Sidebar from './components/Sidebar'
import type { ChatMessage } from './api/webhook'
import { sendChatMessage } from './api/webhook'
import type { Document } from './types'

function App() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeDocument = documents.find(doc => doc.id === activeDocumentId)
  const currentMessages = activeDocument?.messages || []

  const handleUploadSuccess = (fileName: string) => {
    const newDocId = crypto.randomUUID()
    const newDoc: Document = {
      id: newDocId,
      name: fileName,
      messages: [
        {
          role: 'assistant',
          content: `Document "${fileName}" has been successfully indexed. You can now ask questions about it.`
        }
      ]
    }

    setDocuments(prev => [...prev, newDoc])
    setActiveDocumentId(newDocId)
    setIsSidebarOpen(false)
  }

  const handleSendMessage = async (message: string) => {
    if (!activeDocumentId) return

    const userMessage: ChatMessage = { role: 'user', content: message }

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === activeDocumentId
          ? { ...doc, messages: [...doc.messages, userMessage] }
          : doc
      )
    )

    setLoading(true)

    try {
      const answer = await sendChatMessage(message)
      const assistantMessage: ChatMessage = { role: 'assistant', content: answer }

      setDocuments(prev =>
        prev.map(doc =>
          doc.id === activeDocumentId
            ? { ...doc, messages: [...doc.messages, assistantMessage] }
            : doc
        )
      )
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      }

      setDocuments(prev =>
        prev.map(doc =>
          doc.id === activeDocumentId
            ? { ...doc, messages: [...doc.messages, errorMessage] }
            : doc
        )
      )
    } finally {
      setLoading(false)
    }
  }

  if (documents.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-indigo-100 to-rose-100 relative overflow-hidden">

        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-300/40 rounded-full blur-3xl" />

        <div className="w-full max-w-xl flex flex-col items-center relative z-10">

          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-white/60 rounded-xl backdrop-blur border border-white/40 shadow-lg">
              <img
                src="/ThinkDeepLogo.png"
                alt="ThinkDeep Logo"
                className="w-10 h-10 rounded-md"
              />
            </div>
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              ThinkDeep
            </span>
          </div>

          <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Unlock insights from your docs
            </h1>

            <p className="text-lg text-slate-600 mb-10 max-w-sm mx-auto leading-relaxed">
              Upload a PDF to start asking questions summarizing content and analyzing insights instantly
            </p>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-300 to-pink-300 rounded-xl blur opacity-40"></div>
              <div className="relative bg-white/70 border border-white/50 rounded-xl overflow-hidden">
                <FileUploader
                  onUploadSuccess={handleUploadSuccess}
                  variant="landing"
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400 font-medium">
            Powered by RAG ThinkDeep 1.0
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden">

      <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 p-4 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg"
        >
          ☰
        </button>
        <span className="font-semibold text-slate-800">ThinkDeep</span>
      </div>

      <Sidebar
        documents={documents}
        activeDocumentId={activeDocumentId}
        onSelectDocument={setActiveDocumentId}
        onUploadSuccess={handleUploadSuccess}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl overflow-hidden shadow-xl m-0 md:m-3 md:rounded-2xl border border-white/40 mt-16 md:mt-0">

        <div className="border-b border-white/40 p-4 bg-white/70 backdrop-blur flex justify-between items-center sticky top-0">
          <h2 className="text-lg font-semibold text-slate-800 truncate">
            {activeDocument?.name || 'Chat'}
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
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a document from the sidebar
          </div>
        )}
      </div>
    </div>
  )
}

export default App
