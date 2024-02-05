import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import TaskModal from "./components/TaskModal/TaskModal";

export default function App() {
  const task = {};
  return (
    <MantineProvider theme={theme}>
      <TaskModal />
    </MantineProvider>
  );
}
