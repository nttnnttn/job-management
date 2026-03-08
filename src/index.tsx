import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // ← BẮT BUỘC để Tailwind chạy
import { setupApiClient } from "./configs/setup-client";

setupApiClient()

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
