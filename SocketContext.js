import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// const socket = io.connect("localhost:1337/assistant");

// socket.on("connect", () => {
//   console.log("connected");
// });

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser, userId, token } = useContext(AuthContext);

  useEffect(() => {
    console.log("Socket hello");
    console.log(userId);
    try {
      if (userId) {
        const socket = io("http://192.168.150.145:3000");
        socket.on("connect", () => {
          console.log("connected");
        });
        socket.on("connect_error", (error) => {
          console.log("connection error", error);
        });
        setSocket(socket);
        return () => {
          if (socket) socket.close();
        };
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
