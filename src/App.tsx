import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import TaskModal from "./components/TaskModal/TaskModal";
import { Task } from "./interfaces/task";
import { useEffect } from "react";
import { disconnectSocket, initSocket } from "./socket";

export default function App() {
  const task1: Task = {
    id: "",
    title: "",
    description: "",
    status: "",

    createdAt: "",
    updatedAt: "new Date()",
    createdBy: "string",
    updatedBy: "string",
    assignee: " ",
    dueDate: new Date(),
  };

  useEffect(() => {
    initSocket();

    return () => disconnectSocket();
  }, []);
  return (
    <MantineProvider theme={theme}>
      <TaskModal task={task1} />
    </MantineProvider>
  );
}
