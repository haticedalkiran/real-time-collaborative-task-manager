import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import "./layout.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Table from "./components/Table/Table";
import Header from "./components/Header/Header";

export default function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Header />
        <Container size={"xl"}>
          <Table />
        </Container>
      </MantineProvider>
    </Provider>
  );
}
