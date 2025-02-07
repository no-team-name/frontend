// src/services/TeamChatService.js
import { Client } from '@stomp/stompjs';

class TeamChatService {
  constructor() {
    this.client = new Client({
      brokerURL: process.env.REACT_APP_TEAM_CHAT_SOCKET_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공 (순수 WS)");
        if (this.userId) {
          this.subscribeTeamMessages(this.userId);
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
    this.teamId = null;
    this.userId = null;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setTeamId(teamId) {
    this.teamId = teamId;
    if (this.client.connected) {
      this.subscribeTeamMessages(teamId);
    }
  }

  subscribeTeamMessages() {
    console.log(`🔔 구독: /topic/room.${this.teamId}`);
    this.client.subscribe(`/topic/room.${this.teamId}`, (msg) => {
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
        senderId: this.userId,
        message: message,
        teamId: this.teamId,
      });
      this.client.publish({ destination: `/publish/room/${this.teamId}`, body: payload });
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

const teamChatService = new TeamChatService();
export default teamChatService;
