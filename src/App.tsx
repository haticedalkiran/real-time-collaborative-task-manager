import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

import { store } from "./store/store";
import { Provider } from "react-redux";
import { initSocket } from "./socket";
import { useEffect } from "react";

import Container from "./Container";
import Table from "./components/Table/Table";

export default function App() {
  useEffect(() => {
    initSocket();
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Container>
          <Table />
        </Container>
      </MantineProvider>
    </Provider>
  );
}
