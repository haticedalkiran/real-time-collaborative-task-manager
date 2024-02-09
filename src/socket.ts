import io, { Socket } from "socket.io-client";

const SOCKET_URL: string = "http://localhost:3000";

const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

export const initSocket = () => {
  console.log("Connecting...");
  socket.on("connect", () => console.log("connected."));
};

export const receiveTasksSocket = (callback: (data: any) => void) => {
  console.log("receiveTasksSocket");
  socket.on("receive-tasks", (data: any) => {
    callback(data);
  });
};

export const createTaskSocket = (task: any) => {
  if (socket) socket.emit("new-task", task);
};

export const deleteTaskSocket = (id: string) => {
  console.log("deleteTaskSocket", id);
  if (socket) socket.emit("delete-task", id);
};

export const updateTaskSocket = (task: any) => {
  console.log("updateTaskSocket", task);
  if (socket) socket.emit("update-task", task);
};

export default socket;
