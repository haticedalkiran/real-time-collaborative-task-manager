import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import "./layout.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

import { store } from "./store/store";
import { Provider } from "react-redux";
import { initSocket } from "./socket";
import { useEffect } from "react";

import Table from "./components/Table/Table";
import ContainerListener from "./ContainerListener";

export default function App() {
  useEffect(() => {
    initSocket();
    return () => {
      //  disconnectSocket();
    };
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <ContainerListener>
          <Table />
        </ContainerListener>
      </MantineProvider>
    </Provider>
  );
}
