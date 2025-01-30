import { Client } from '@stomp/stompjs';

class AiChatService {
  constructor() {
    this.client = new Client({
      brokerURL: "ws://localhost:8082/spring/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공 (순수 WS)");
        this.client.subscribe('/topic/messages', (msg) => {
          this.onMessageReceived(msg.body);
        });
      },
      onDisconnect: () => {
        console.log("❌ WebSocket 연결 종료");
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류 발생:", frame.headers["message"]);
      },
    });

    this.onMessageReceived = () => {};
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
      this.client.publish({ destination: "/app/chat", body: message });
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
