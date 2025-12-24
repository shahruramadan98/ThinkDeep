/**
 * API Service for n8n Webhook Integration
 * Handles both chat queries and file uploads to the RAG workflow
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/ThinkDeep';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    type: 'chat';
    message: string;
}

export interface ChatResponse {
    answer: string;
}

export interface UploadResponse {
    status: string;
    message: string;
}

/**
 * Send a chat message to the RAG workflow
 */
export async function sendChatMessage(message: string): Promise<string> {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'chat',
                message,
            } as ChatRequest),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();

        console.log('Chat response content-type:', contentType);
        console.log('Chat response body:', responseText);

        // Try to parse as JSON if there's content
        if (responseText && responseText.trim()) {
            try {
                const data: ChatResponse = JSON.parse(responseText);
                return data.answer || responseText;
            } catch (parseError) {
                console.warn('Response is not JSON, using text response:', responseText);
                // If not JSON but successful, return the text
                return responseText;
            }
        }

        // Empty response
        throw new Error('Received empty response from server');
    } catch (error) {
        console.error('Chat error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to send message. Please try again.');
    }
}

/**
 * Upload a PDF file to the RAG workflow for indexing
 */
export async function uploadFile(file: File): Promise<string> {
    try {
        // Validate file type
        if (file.type !== 'application/pdf') {
            throw new Error('Only PDF files are supported');
        }

        const formData = new FormData();
        formData.append('type', 'upload');
        formData.append('file', file);

        // Debug logging
        console.log('=== Upload Request Debug ===');
        console.log('Webhook URL:', WEBHOOK_URL);
        console.log('File name:', file.name);
        console.log('File type:', file.type);
        console.log('File size:', file.size, 'bytes');
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();

        console.log('Upload response content-type:', contentType);
        console.log('Upload response body:', responseText);

        // Try to parse as JSON if there's content
        if (responseText && responseText.trim()) {
            try {
                const data: UploadResponse = JSON.parse(responseText);
                return data.message || 'Document uploaded successfully';
            } catch (parseError) {
                console.warn('Response is not JSON, using text response:', responseText);
                // If not JSON but successful, return the text or a success message
                return responseText || 'Document uploaded successfully';
            }
        }

        // Empty response but status was OK
        return 'Document uploaded successfully';
    } catch (error) {
        console.error('Upload error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to upload file. Please try again.');
    }
}
