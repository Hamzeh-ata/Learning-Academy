import * as signalR from '@microsoft/signalr';
import AlertService from '../alert/alert.service';

class SignalRService {
  BASE_URL = `${window.location.origin || import.meta.env.VITE_API_TARGET}/Notifications`;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.BASE_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.onReceiveNotification();
  }

  async start() {
    try {
      console.log('SignalR Connected.');
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        return;
      }
      await this.connection.start();
    } catch (err) {
      console.error('Error while starting SignalR connection: ', err);
      setTimeout(async () => {
        if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
          return;
        }
        await this.connection.start();
      }, 5000); // Retry connection after 5 seconds
    }
  }

  async stop() {
    await this.connection.stop();
    console.log('SignalR Disconnected.');
  }
  subscribeToNotifications(topic) {
    this.connection
      .invoke('SubscribeToTopic', topic)
      .then(() => {
        console.log('subscribed to topic', topic);
      })
      .catch((err) => console.error(err.toString()));
  }

  sendUserTypingNotification(groupId, user) {
    this.connection.invoke('SendUserTypingNotification', groupId, user).catch((err) => console.error(err.toString()));
  }

  onMessageReceived(key, callback) {
    this.connection.on(key, (message) => {
      callback(message);
    });
  }

  onReceiveNotification() {
    this.connection.on('ReceiveNotification', (message) => {
      console.log(`Message for user ${message}`);
      AlertService.showToast({ type: 'info', title: message });
    });
  }
}

const signalRService = new SignalRService();
export default signalRService;
