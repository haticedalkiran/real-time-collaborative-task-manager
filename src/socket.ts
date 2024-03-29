import io, { Socket } from "socket.io-client";
import { Task } from "./interfaces/task";
import { store } from "./store/store";
import { addTask, deleteTask, updateTask } from "./store/tasks.state";

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

export const initSocket = () => {
  console.log("Connecting...");
  socket.on("connect", () => console.log("connected."));
};

//create
export const createTaskSocket = (task: Task) => {
  if (socket) {
    socket.emit("new-task", task);
  }
};

//read
export const receiveTasksSocket = (callback: (data: Task[]) => void) => {
  socket.on("receive-tasks", (data: Task[]) => {
    callback(data);
  });
};

//update
export const updateTaskSocket = (task: Task) => {
  if (socket) socket.emit("update-task", task);
};

//delete
export const deleteTaskSocket = (id: string) => {
  if (socket) socket.emit("delete-task", id);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

//listeners
socket.on("task-deleted", (taskId: string) => {
  store.dispatch(deleteTask(taskId));
});

socket.on("task-created", (newTask: Task) => {
  store.dispatch(addTask(newTask));
});

socket.on("task-updated", (updatedTask: Task) => {
  store.dispatch(updateTask(updatedTask));
});

socket.on("error", (error: string) => {
  console.log(error);
});

export default socket;
