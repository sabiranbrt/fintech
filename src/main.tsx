import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store/index";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
