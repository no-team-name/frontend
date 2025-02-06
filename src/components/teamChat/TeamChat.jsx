import React, { useState, useEffect, useRef } from "react";
import { userState } from "../../recoil/UserAtoms";
import teamChatService from "../../service/TeamChatService";
import { getTeamChatHistory } from "../../service/TeamChatHistoryService";
import { useRecoilValue } from 'recoil';

const TeamChat = ({ teamId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chunkNumber, setChunkNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const user = useRecoilValue(userState);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchChatHistories = async () => {
      try {
        const response = await getTeamChatHistory(teamId, chunkNumber);
        const newMessage = response.data.content;
        setMessages((prevMessages) => Array.isArray(prevMessages) ? [...newMessage, ...prevMessages] : newMessage);
        if (newMessage.length < 20) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching team chat history:", error);
      }
    }
    if (hasMore) {
      fetchChatHistories();
    }
  }, [teamId, chunkNumber]);

  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (user.isLogin && user.memberId) {
      console.log("teamId:", teamId);
      teamChatService.setTeamId(teamId);
      teamChatService.setUserId(user.memberId);
      teamChatService.connect();

      const handleMessage = (msgBody) => {
      try {
        const data = JSON.parse(msgBody);
        console.log(data);
        setMessages((prevMessages) => Array.isArray(prevMessages) ? [...prevMessages, data] : [data]);
        scrollToBottom();
      } catch (e) {
        console.error("JSON 파싱 에러:", e);
      }
    };
      teamChatService.setOnMessageReceived(handleMessage);
    }
    return () => {
      teamChatService.removeOnMessageReceived();
      teamChatService.disconnect();
    };
  }, [user.isLogin, user.memberId, teamId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    teamChatService.sendMessage(newMessage);
    setNewMessage("");
  }

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && hasMore) {
      setChunkNumber(prevChunkNumber => prevChunkNumber + 1);
    }
    setIsUserScrolling(true);
    clearTimeout(chatContainerRef.current.scrollTimeout);
    chatContainerRef.current.scrollTimeout = setTimeout(() => {
      setIsUserScrolling(false);
    }, 100);
  }

  return (
    <div className="fixed top-0 right-4 w-1/4 h-3/4 bg-white shadow-lg z-50 flex flex-col rounded-lg" style={{ zIndex: 1100 }}>
      <div className="flex justify-between items-center p-4 border-b border-gray-300 rounded-t-lg">
        <h2 className="text-lg font-semibold">Team Chat</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          X
        </button>
      </div>
      <div 
        className="flex-1 overflow-y-auto p-4"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages?.map((message) => (
          <div
            key={message.messageId}
            className={`mb-2 flex ${message.senderId === user.memberId ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderId !== user.memberId && (
              <img
                src={message.senderProfileImageUrl || "data:image/jpeg;base64,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"}
                alt={message.senderName}
                className="w-10 h-10 rounded-full mr-2"
              />
            )}
            <div className="max-w-xs">
              <div className="text-sm font-semibold">{message.senderName}</div>
              <div className="text-sm bg-gray-200 p-2 rounded-lg">{message.message}</div>
              <div className="text-xs text-gray-500">{message.sendDateTime}</div>
            </div>
            {message.senderId === user.memberId && (
              <img
                src={message.senderProfileImageUrl || "data:image/jpeg;base64,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"}
                alt={message.senderName}
                className="w-10 h-10 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300 rounded-b-lg flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeamChat;