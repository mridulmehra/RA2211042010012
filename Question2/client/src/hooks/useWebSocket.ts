import { useEffect, useState, useRef } from 'react';

export type WebSocketMessage = {
  data: string;
  type: string;
  event: string;
};

const useWebSocket = (socketUrl: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const connect = () => {
      // Only attempt to reconnect a reasonable number of times
      if (connectionAttempts > 5) return;
      
      try {
        // Construct the WebSocket URL with the correct protocol
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = socketUrl.startsWith('ws') 
          ? socketUrl 
          : `${protocol}//${window.location.host}${socketUrl}`;
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        
        socket.onopen = () => {
          setIsConnected(true);
          setConnectionAttempts(0);
          console.log('WebSocket connected');
        };
        
        socket.onclose = () => {
          setIsConnected(false);
          console.log('WebSocket disconnected, attempting to reconnect...');
          // Attempt to reconnect with exponential backoff
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connect();
          }, 1000 * Math.min(30, Math.pow(2, connectionAttempts)));
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          socket.close();
        };
        
        socket.onmessage = (event) => {
          const message = {
            data: event.data,
            type: typeof event.data,
            event: event.type,
          };
          setLastMessage(message);
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        // Attempt to reconnect
        setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          connect();
        }, 1000 * Math.min(30, Math.pow(2, connectionAttempts)));
      }
    };
    
    connect();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [socketUrl, connectionAttempts]);
  
  // Function to send messages through the WebSocket
  const sendMessage = (data: string | object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (typeof data === 'object') {
        socketRef.current.send(JSON.stringify(data));
      } else {
        socketRef.current.send(data);
      }
      return true;
    }
    return false;
  };
  
  return { isConnected, lastMessage, sendMessage };
};

export default useWebSocket;
