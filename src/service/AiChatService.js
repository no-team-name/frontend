// src/services/AiChatService.js
import { Client } from '@stomp/stompjs';

class AiChatService {
  constructor() {
    this.client = new Client({
      brokerURL: process.env.REACT_APP_AI_CHATBOT_SOCKET_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공 (순수 WS)");
        if (this.userId) {
          this.subscribeToUserMessages(this.userId);
        }
      },
      onDisconnect: () => {
        console.log("❌ WebSocket 연결 종료");
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류 발생:", frame.headers["message"]);
      },
    });

    this.onMessageReceived = () => {};
    this.userId = null;
  }

  setUserId(userId) {
    this.userId = userId;
    if (this.client.connected) {
      this.subscribeToUserMessages(userId);
    }
  }

  subscribeToUserMessages(userId) {
    this.client.subscribe(`/topic/messages.${userId}`, (msg) => {
      this.onMessageReceived(msg.body);
    });
  }

  connect() {
    if (!this.client.active && !this.client.connected) {
      this.client.activate();
    }
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  sendMessage(message) {
    if (this.client.connected) {
      const payload = JSON.stringify({
        memberId: this.userId,
        message: message,
      });
      this.client.publish({ destination: "/app/chat", body: payload });
    } else {
      console.error("⚠️ WebSocket이 연결되지 않았습니다.");
    }
  }

  setOnMessageReceived(callback) {
    this.onMessageReceived = callback;
  }

  removeOnMessageReceived() {
    this.onMessageReceived = () => {};
  }
}

const aiChatService = new AiChatService();
export default aiChatService;