import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import './ChatButton.css';

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      <AiOutlineMessage size={24} />
    </button>
  );
};

export default ChatButton;