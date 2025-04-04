import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Ensure this matches the backend

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    sales: [],
    traffic: [],
    inventory: [],
    userActivity: [],
  });

  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      transports: ["websocket", "polling"], // Ensure fallback
    });

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("🟢 Connected to WebSocket server");
    });

    socketConnection.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket server");
    });

    // Event listeners
    socketConnection.on("salesUpdate", (data) => {
      console.log("🔵 Received sales data:", data);  // Add this log
      setAnalyticsData((prevData) => ({
        ...prevData,
        sales: [...prevData.sales, data],
      }));
    });

    socketConnection.on("trafficUpdate", (data) => {
      setAnalyticsData((prevData) => ({
        ...prevData,
        traffic: [...prevData.traffic, data],
      }));
    });

    socketConnection.on("userActivityUpdate", (data) => {
      setAnalyticsData((prevData) => ({
        ...prevData,
        userActivity: [...prevData.userActivity, data],
      }));
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return analyticsData;
};

export default useSocket;
