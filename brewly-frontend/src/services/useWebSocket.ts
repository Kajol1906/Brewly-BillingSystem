import { useEffect, useRef } from 'react';

/**
 * A lightweight, zero-dependency custom hook to subscribe to Spring Boot STOMP WebSockets.
 * Uses useRef for the callback to prevent reconnection loops from changing references.
 */
export function useWebSocket(topic: string, onMessage: () => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const onMessageRef = useRef(onMessage);

  // Keep callback ref current without triggering reconnects
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let isMounted = true;

    function connect() {
      if (socketRef.current) return;

      // Spring Boot backend typically runs on 8080
      const wsUrl = `ws://localhost:8080/ws-pos`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) {
          ws.close();
          return;
        }
        // Send STOMP CONNECT Frame
        ws.send("CONNECT\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\u0000");
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        const msg = event.data;

        // If connected, subscribe to the topic
        if (msg.startsWith("CONNECTED")) {
          // Send STOMP SUBSCRIBE Frame
          ws.send(`SUBSCRIBE\nid:sub-0\ndestination:${topic}\n\n\u0000`);
        } else if (msg.includes("MESSAGE") && msg.includes(`destination:${topic}`)) {
          // Trigger the callback when a message is received on this topic
          onMessageRef.current();
        }
      };

      ws.onclose = () => {
        socketRef.current = null;
        if (isMounted) {
          // Attempt reconnection after 5 seconds
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error, closing...", err);
        ws.close();
      };
    }

    connect();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [topic]); // Only reconnect when topic changes, not when callback changes
}
