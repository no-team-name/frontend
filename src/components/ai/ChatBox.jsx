import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import aiChatService from '../../service/AiChatService';

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 현재 타이핑 중인 AI 답변 (중간 메시지)
  const [currentBotMessage, setCurrentBotMessage] = useState("");

  // 로딩 여부 (첫 글자 전까지 "로딩 중" 표시)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    aiChatService.connect();

  const handleMessage = (msgBody) => {
    try {
      const data = JSON.parse(msgBody);
      if (data.type === "continue") {
        setIsLoading(false);
        setCurrentBotMessage((prev) => prev + data.text);
      } else if (data.type === "complete") {
        const finalText = currentBotMessage + data.text;
        setMessages((prev) => [...prev, { text: finalText, sender: "bot" }]);
        setCurrentBotMessage("");
        setIsLoading(false);
      }
    } catch (e) {
      console.error("JSON 파싱 에러:", e);
    }
  };

  aiChatService.setOnMessageReceived(handleMessage);

    return () => {
      aiChatService.removeOnMessageReceived();
      aiChatService.disconnect();
    };
  }, []);

  // 유저가 메세지 전송
  const sendMessage = () => {
    if (!input.trim()) return;
    // 사용자 메세지 추가
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    // 새로운 AI 답변 받을 준비
    setCurrentBotMessage("");
    setIsLoading(true);
    aiChatService.sendMessage(input);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>AI Chat</h2>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}

        {/* 로딩 중 표시 & 아직 타이핑 시작 안 했을 때 */}
        {isLoading && !currentBotMessage && (
          <div className="chat-message bot">AI 응답을 기다리는 중...</div>
        )}

        {/* 타이핑 중인 메시지 (continue 파편) */}
        {currentBotMessage && (
          <div className="chat-message bot">{currentBotMessage}</div>
        )}
      </div>

      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
