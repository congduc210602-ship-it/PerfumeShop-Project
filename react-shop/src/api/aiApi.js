// src/api/aiApi.js
import api from './axiosConfig';

/**
 * Gửi tin nhắn đến AI và nhận câu trả lời.
 * API: POST /api/ai/chat
 */
export const getAiChatResponse = (message) => {
    return api.post('/ai/chat', { message });
};