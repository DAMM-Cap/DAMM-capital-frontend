import ProvidersWrapper from "@/hoc/providers-wrapper.tsx";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
(window as any).Buffer ??= Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProvidersWrapper>
      <App />
    </ProvidersWrapper>
  </React.StrictMode>,
);
