import { useEffect, useState } from "react";

const WS_SERVER = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_SERVER);

    ws.onopen = () => {
      //    console.log("Connected to server");
      setSocket(ws);
    };
    ws.onclose = () => {
      //console.log("Disconnected from server");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
