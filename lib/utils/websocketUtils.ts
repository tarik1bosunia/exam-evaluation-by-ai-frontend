// // Helper to get WebSocket URL
// export const getWebSocketUrl = (path: string) => {
//   const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
//   return `${wsProtocol}://${window.location.host}${path}`;
// };

// // Connection status tracker
// export const trackConnectionQuality = () => {
//   let latency = 0;
//   let packetLoss = 0;
  
//   return {
//     recordPing: (pingTime: number) => {
//       latency = (latency * 0.7) + (pingTime * 0.3);
//     },
//     recordPacketLoss: () => {
//       packetLoss = packetLoss * 0.9 + 0.1;
//     },
//     getConnectionQuality: () => {
//       if (latency > 500 || packetLoss > 0.1) return 'poor';
//       if (latency > 200 || packetLoss > 0.05) return 'fair';
//       return 'good';
//     }
//   };
// };

// // Message queue for offline support
// export class MessageQueue {
//   private queue: any[] = [];
  
//   enqueue(message: any) {
//     this.queue.push(message);
//   }
  
//   dequeueAll() {
//     const messages = [...this.queue];
//     this.queue = [];
//     return messages;
//   }
  
//   get size() {
//     return this.queue.length;
//   }
// }