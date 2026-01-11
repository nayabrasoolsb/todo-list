import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import RoutesConfig from "./routes/RoutesConfig";

function App() {
  return (
    <MantineProvider theme={{
      fontFamily: "Inter, sans-serif",
    }}>
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
