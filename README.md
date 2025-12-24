# RAG ThinkDeep - Frontend Application

A clean, minimal, production-ready React frontend for interacting with the n8n RAG (Retrieval-Augmented Generation) workflow.

## Features

- 📄 **PDF Document Upload** - Upload PDF files for indexing in the RAG system
- 💬 **Interactive Chat** - Ask questions about uploaded documents
- 🎨 **NotebookLLM-style Interface** - Clean two-panel layout for optimal user experience
- ⚡ **Real-time Updates** - Immediate feedback for uploads and chat responses
- 🛡️ **Error Handling** - Graceful error handling with user-friendly messages

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── webhook.ts          # API service for n8n webhook communication
│   ├── components/
│   │   ├── ChatBubble.tsx      # Individual chat message component
│   │   ├── ChatInput.tsx       # Message input with send button
│   │   ├── ChatWindow.tsx      # Scrollable chat history container
│   │   └── FileUploader.tsx    # PDF upload component
│   ├── App.tsx                 # Main application layout
│   ├── main.tsx                # Application entry point
│   └── index.css               # Tailwind CSS imports
├── .env                        # Environment variables (local)
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- n8n workflow running with webhook endpoint

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/adan/n8nRagProject/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to set your webhook URL if different from default:
   ```env
   VITE_WEBHOOK_URL=http://localhost:5678/webhook/ThinkDeep
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

## Usage

### 1. Upload a Document

- Click the upload area in the left panel
- Select a PDF file from your computer
- Wait for the success message confirming indexing

### 2. Start Chatting

- Once a document is uploaded, the chat input becomes enabled
- Type your question in the input field
- Press Enter or click "Send"
- View the AI's response in the chat window

### 3. Upload Additional Documents

- You can upload multiple PDFs
- Each upload will be indexed in the RAG system
- Previously uploaded documents remain accessible

## API Integration

The application integrates with the n8n webhook at `http://localhost:5678/webhook/ThinkDeep` with two modes:

### Chat Mode
```typescript
POST /webhook/ThinkDeep
Content-Type: application/json

{
  "type": "chat",
  "message": "Your question here"
}

Response:
{
  "answer": "AI response"
}
```

### Upload Mode
```typescript
POST /webhook/ThinkDeep
Content-Type: multipart/form-data

FormData {
  type: "upload",
  file: <PDF file>
}

Response:
{
  "status": "success",
  "message": "Document indexed successfully"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The production files will be generated in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory:

```env
# Webhook URL for n8n RAG workflow
VITE_WEBHOOK_URL=http://localhost:5678/webhook/ThinkDeep
```

## Component Overview

### `FileUploader`
- Handles PDF file selection and upload
- Validates file type (PDF only)
- Displays upload progress and status
- Shows list of indexed documents

### `ChatWindow`
- Displays chat message history
- Auto-scrolls to latest message
- Shows loading indicator during responses
- Empty state when no messages

### `ChatBubble`
- Renders individual chat messages
- Different styling for user vs AI messages
- Supports multi-line text

### `ChatInput`
- Text input for user questions
- Send button with loading state
- Disabled state when no documents uploaded
- Keyboard shortcut (Enter to send)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Errors
Ensure your n8n workflow has CORS enabled on the webhook node.

### Webhook Not Responding
1. Verify n8n is running at `localhost:5678`
2. Check the webhook URL in your `.env` file
3. Ensure the workflow is activated in n8n

### Upload Failing
- Verify file is a valid PDF
- Check file size limits in your n8n workflow
- Review browser console for detailed errors

## License

MIT

## Contributing

This is a production-ready frontend application. For modifications:

1. Make changes to components in `src/components/`
2. Update API logic in `src/api/webhook.ts`
3. Test thoroughly before deploying
4. Build for production before deployment
