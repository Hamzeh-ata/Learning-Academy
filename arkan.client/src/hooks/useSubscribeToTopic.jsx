import signalRService from '@/services/signalr-service';
import { useEffect } from 'react';

export function useSubscribeToTopic(topic) {
  useEffect(() => {
    async function start() {
      await signalRService.start();
      signalRService.subscribeToNotifications(topic);
    }
    start();
    return () => {
      async function Stop() {
        await signalRService.stop();
      }
      Stop();
    };
  }, []);
}
