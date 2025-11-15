// src/components/shop/ChatWidget.js
import React, { useState, useRef, useEffect } from 'react';
import * as aiApi from '../../api/aiApi'; // Trỏ đến file api mới
import './ChatWidget.css'; // Chúng ta sẽ tạo CSS

// Icon (lấy từ Footer của bạn)
const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" /></svg>
);
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" /></svg>
);

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Chào bạn! Tôi là trợ lý AI của PerfumeShop. Bạn cần tư vấn về mùi hương nào?' }
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef(null);

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userMessage = currentMessage.trim();
        if (!userMessage) return;

        // Thêm tin nhắn của user vào state
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setCurrentMessage('');
        setIsLoading(true);
        
        try {
            // Gọi API
            const response = await aiApi.getAiChatResponse(userMessage);
            // Thêm tin nhắn trả lời của AI
            setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
        } catch (error) {
            console.error("Lỗi chat AI:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'Xin lỗi, tôi đang gặp lỗi. Vui lòng thử lại sau.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget-container">
            {/* Cửa sổ chat */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>PerfumeShop AI</h4>
                        <button onClick={() => setIsOpen(false)} className="close-chat-btn">
                            <CloseIcon />
                        </button>
                    </div>
                    
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <div className="message-bubble">{msg.text}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message ai">
                                <div className="message-bubble typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <form className="chat-input-form" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>Gửi</button>
                    </form>
                </div>
            )}

            {/* Nút bấm để mở chat */}
            <button className="chat-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
};

export default ChatWidget;