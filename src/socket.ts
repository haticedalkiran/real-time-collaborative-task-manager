import io, { Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = () => {
  socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });
  console.log("Connecting...");
  socket.on("connect", () => console.log("Connected!"));
};

export const sendMessage = (message: string) => {
  if (socket) socket.emit("new-message", message);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const createTask = (task: any) => {
  if (socket) socket.emit("create-task", task);
};
