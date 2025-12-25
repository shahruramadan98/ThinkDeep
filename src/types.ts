export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface Document {
    id: string;
    name: string;
    messages: ChatMessage[];
}
