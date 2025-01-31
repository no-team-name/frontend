// src/service/ParticipantsSocketService.js
class ParticipantsSocketService {
  constructor() {
    this.socket = null;
    this.messageHandler = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(process.env.REACT_APP_WEBRTC_URL);

      this.socket.onopen = () => {
        console.log("[ParticipantsWS] connected");
        resolve();
      };

      this.socket.onerror = (err) => {
        console.error("[ParticipantsWS] error:", err);
        reject(err);
      };

      this.socket.onclose = () => {
        console.log("[ParticipantsWS] closed");
      };

      this.socket.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        if (this.messageHandler) {
          this.messageHandler(data);
        }
      };
    });
  }

  sendMessage(msg) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    }
  }

  addMessageHandler(handler) {
    this.messageHandler = handler;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const participantsSocketService = new ParticipantsSocketService();
export default participantsSocketService;
