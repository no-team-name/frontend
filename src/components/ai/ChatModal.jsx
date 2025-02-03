import React, { useState } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // AI 응답 추가 (여기서는 간단히 예시로 추가)
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: 'user' },
        { text: 'AI 응답 예시', sender: 'ai' },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-content">
        <div className="chat-header">
          <h2>AI Chat</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="chat-body">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;